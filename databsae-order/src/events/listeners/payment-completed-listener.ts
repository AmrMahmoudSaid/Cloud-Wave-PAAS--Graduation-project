import {
    Listener,
    Subjects,
    PaymentCompletedEvent,
    OrderStatus
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    readonly subject = Subjects.PaymentCompleted
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCompletedEvent['data'], msq: Message){
        const order = await Order.findById(data.orderId);
        if (!order){
            throw new Error(`order not found with id ${data.orderId}`);
        }
        order.status = OrderStatus.Complete;
        await order.save();
        msq.ack();
    }
}
