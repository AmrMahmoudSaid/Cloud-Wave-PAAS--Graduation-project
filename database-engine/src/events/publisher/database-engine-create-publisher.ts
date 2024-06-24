import {Publisher, DatabaseEngineCreateEvent, Subjects} from "@cloud-wave/common";
export class DatabaseEngineCreatePublisher extends Publisher<DatabaseEngineCreateEvent>{
    readonly subject = Subjects.DatabaseEngineCreate;
}