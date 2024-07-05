import {
    Listener,
    ApplicationOrderCreateEvent,
    Subjects,
    ApplicationPlan, NotAuthorizedError, OrderStatus, BadRequestError
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Product} from "../../models/product";
import Stripe from "stripe";
import {User} from "../../models/user";
import {Order} from "../../models/order";
import {PaymentCompletedPublisher} from "../publisher/payment-completed-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {ApplicationPaymentCompletedPublisher} from "../publisher/application-payment-completed-publisher";
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20'
});

export class ApplicationOrderCreateListener extends Listener<ApplicationOrderCreateEvent> {
    readonly subject = Subjects.ApplicationCreate
    queueGroupName = queueGroupName;

    async onMessage(data: ApplicationOrderCreateEvent['data'], msq: Message){
        const expirationDate = new Date();
        let planPrice = 0;
        if(data.plan == "Basic"){
            planPrice = ApplicationPlan.BasicPrice;
        } else if (data.plan == "Pro"){
            planPrice = ApplicationPlan.ProPrice;
        } else if (data.plan == "Super"){
            planPrice = ApplicationPlan.SuperPrice;
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
            console.log(user);
            if (!user){
                throw new NotAuthorizedError();
            }

            const subscription = await stripe.subscriptions.create({
                customer: user.customerId,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
            });
            const subscriptionId = subscription.id;
            const order = Order.build({
                id: data.orderId,
                userId: data.userId,
                subscriptionId,
                price: planPrice
            });
            await order.save();

            await new ApplicationPaymentCompletedPublisher(natsWrapper.client).publish({
                userId: data.userId,
                status: OrderStatus.Created,
                expiresAt: expirationDate,
                databaseOrderType: data.databaseOrderType,
                price: planPrice,
                applicationName: data.applicationName,
                orderId: order.id,
                gitUrl: data.gitUrl,
                plan: data.plan,
                port:data.port,
                email: user.email,
                envVariables: data.envVariables,
            });
            msq.ack();
        } catch (error) {
            console.log(error);
            throw new BadRequestError('Error in payment');
        }
    }
}
