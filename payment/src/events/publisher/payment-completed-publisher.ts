import {Publisher, PaymentCompletedEvent, Subjects} from "@cloud-wave/common";
export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent>{
    readonly subject = Subjects.PaymentCompleted;
}