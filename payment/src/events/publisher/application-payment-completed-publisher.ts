import {Publisher, PaymentCompletedEvent, Subjects} from "@cloud-wave/common";
export class ApplicationPaymentCompletedPublisher extends Publisher<PaymentCompletedEvent>{
    readonly subject = Subjects.PaymentCompleted;
}