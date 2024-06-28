import {
    Listener,
    Subjects,
    ApplicationPaymentCompletedEvent,
    OrderStatus
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class AppPaymentCompletedListener extends Listener<ApplicationPaymentCompletedEvent> {
    readonly subject = Subjects.ApplicationPaymentCompleted
    queueGroupName = queueGroupName;

    async onMessage(data: ApplicationPaymentCompletedEvent['data'], msq: Message){
        const order = await Order.findById(data.orderId);
        if (!order){
            throw new Error(`order not found with id ${data.orderId}`);
        }
        order.status = OrderStatus.Complete;
        await order.save();
        msq.ack();
    }
}
