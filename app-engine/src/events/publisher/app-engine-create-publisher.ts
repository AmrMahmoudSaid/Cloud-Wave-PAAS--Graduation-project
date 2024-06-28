import {Publisher, DatabaseEngineCreateEvent, Subjects} from "@cloud-wave/common";
export class AppEngineCreatePublisher extends Publisher<DatabaseEngineCreateEvent>{
    readonly subject = Subjects.DatabaseEngineCreate;
}