import {Publisher, DatabaseDeleteEvent, Subjects} from "@cloud-wave/common";
export class AppDeletePublisher extends Publisher<DatabaseDeleteEvent>{
    readonly subject = Subjects.DatabaseDelete;
}