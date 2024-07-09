import {
    Listener,
    DatabaseDeleteEvent,
    Subjects,
    k8sAppsApi, k8sCoreApi, BadRequestError
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20'
});
export class DatabaseDeleteListener extends Listener<DatabaseDeleteEvent> {
    readonly subject = Subjects.DatabaseDelete
    queueGroupName = queueGroupName;
    async onMessage(data: DatabaseDeleteEvent['data'], msq: Message){

        try {
            const order  = await Order.findOne({
                userId:data.userId,
                appName: data.deploymentName
            });
            if (!order){
                console.log("No order found for this application");
                msq.ack()
                throw new BadRequestError('Error in order');
            }
            const deletedSubscription = await stripe.subscriptions.cancel(order.subscriptionId);
            console.log('Subscription deleted:', deletedSubscription);
            msq.ack();
        } catch (err) {
            console.error('Error deleting subscription:', err);
            msq.ack();
        }
    }
}
