import {Publisher, DatabaseDeleteEvent, Subjects} from "@cloud-wave/common";
export class DatabaseDeletePublisher extends Publisher<DatabaseDeleteEvent>{
    readonly subject = Subjects.DatabaseDelete;
}