import {
    Listener,
    PaymentCompletedEvent,
    Subjects,
} from "@cloud-wave/common";
import {queueGroupName} from "./queu-group-name";
import {Message} from "node-nats-streaming";
import {Emails} from "../../emails";
export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    readonly subject = Subjects.PaymentCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCompletedEvent['data'], msq: Message){
        await new Emails(data.email,data.userName,"","",data.price,data.plan.toString()).payment();
        msq.ack();
    }
}
