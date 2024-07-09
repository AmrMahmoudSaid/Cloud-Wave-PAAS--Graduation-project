import {
    Listener,
    DatabaseOrderCreateEvent,
    Subjects,
    DatabasePlans, NotAuthorizedError, OrderStatus, BadRequestError
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Product} from "../../models/product";
import Stripe from "stripe";
import {User} from "../../models/user";
import {Order} from "../../models/order";
import {PaymentCompletedPublisher} from "../publisher/payment-completed-publisher";
import {natsWrapper} from "../../nats-wrapper";
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20'
});

export class DatabaseOrderCompletedListener extends Listener<DatabaseOrderCreateEvent> {
    readonly subject = Subjects.DatabaseOrderCreate
    queueGroupName = queueGroupName;

    async onMessage(data: DatabaseOrderCreateEvent['data'], msq: Message){
        const expirationDate = new Date();
        let planPrice = 0;
        if(data.plan == "Basic"){
            planPrice = DatabasePlans.BasicPrice;
        } else if (data.plan == "Pro"){
            planPrice = DatabasePlans.ProPrice;
        } else if (data.plan == "Super"){
            planPrice = DatabasePlans.SuperPrice;
        }
        try {
            const productEntity = await Product.findOne({ name: data.plan.toString() });
            let priceId;
            if(!productEntity){
                const product = await stripe.products.create({
                    name: `${data.plan} Subscription`,
                });
                const price = await stripe.prices.create({
                    unit_amount: planPrice * 100, // Amount in cents
                    currency: 'usd',
                    recurring: { interval: 'month' },
                    product: product.id,
                });
                const prod = Product.build({
                    name: data.plan.toString(),
                    priceId: price.id
                });
                await prod.save();
                priceId = prod.priceId;
            } else {
                priceId = productEntity.priceId;
            }

            const user = await User.findById(data.userId);
            if (!user){
                throw new NotAuthorizedError();
            }

            const subscription = await stripe.subscriptions.create({
                customer: user.customerId,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
            });
            const subscriptionId = subscription.id;
            console.log("ammmr");
            console.log(data);
            const order = Order.build({
                id: data.orderId,
                userId: data.userId,
                subscriptionId,
                price: planPrice,
                appName:data.deploymentName

            });
            await order.save();

            await new PaymentCompletedPublisher(natsWrapper.client).publish({
                userId: data.userId,
                status: OrderStatus.Created,
                expiresAt: expirationDate,
                databaseOrderType: data.databaseOrderType,
                price: planPrice,
                plan: data.plan,
                rootPassword: data.rootPassword,
                databaseName: data.databaseName,
                userName: data.userName,
                userPassword: data.userPassword,
                orderId: order.id,
                email: user.email
            });
            msq.ack();
        } catch (error) {
            console.log(error);
            msq.ack();
        }
    }
}
