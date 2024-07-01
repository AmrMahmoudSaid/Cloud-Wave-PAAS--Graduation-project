import {Publisher, ApplicationDeleteEvent, Subjects} from "@cloud-wave/common";
export class AppDeletePublisher extends Publisher<ApplicationDeleteEvent>{
    readonly subject = Subjects.ApplicationDelete;
}