import {Publisher, ApplicationOrderCreateEvent, Subjects} from "@cloud-wave/common";
export class ApplicationOrderCreatePublisher extends Publisher<ApplicationOrderCreateEvent>{
    readonly subject = Subjects.ApplicationCreate;
}