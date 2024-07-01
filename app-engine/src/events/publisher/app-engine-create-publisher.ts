import {Publisher, ApplicationEngineCreateEvent, Subjects} from "@cloud-wave/common";
export class AppEngineCreatePublisher extends Publisher<ApplicationEngineCreateEvent>{
    readonly subject = Subjects.ApplicationEngineCreate;
}