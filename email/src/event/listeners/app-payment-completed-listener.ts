import {
  Listener,
  Subjects,
  ApplicationPaymentCompletedEvent,
} from "@cloud-wave/common";
import { queueGroupName } from "./queu-group-name";
import { Message } from "node-nats-streaming";
import {Emails} from "../../emails";
export class AppPaymentCompletedListener extends Listener<ApplicationPaymentCompletedEvent> {
  readonly subject = Subjects.ApplicationPaymentCompleted;
  queueGroupName = queueGroupName;
  async onMessage(
    data: ApplicationPaymentCompletedEvent["data"],
    msq: Message
  ) {
    try {

      await new Emails(data.email,data.email,"","",data.price,data.plan.toString()).payment();
      msq.ack();
    }catch (err){
      msq.ack();
      throw err;
    }
  }
}
