import {Publisher, ApplicationPaymentCompletedEvent, Subjects,} from "@cloud-wave/common";
export class ApplicationPaymentCompletedPublisher extends Publisher<ApplicationPaymentCompletedEvent>{
    readonly subject = Subjects.ApplicationPaymentCompleted;
}