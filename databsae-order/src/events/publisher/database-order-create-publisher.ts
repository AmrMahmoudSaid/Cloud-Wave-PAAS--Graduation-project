import {Publisher, DatabaseOrderCreateEvent, Subjects} from "@cloud-wave/common";
export class DatabaseOrderCreateEventPublisher extends Publisher<DatabaseOrderCreateEvent>{
    readonly subject = Subjects.DatabaseOrderCreate;
}