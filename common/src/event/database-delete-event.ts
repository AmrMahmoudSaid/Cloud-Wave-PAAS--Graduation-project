import {Subjects} from "./subjects";
export interface DatabaseDeleteEvent {
    subject: Subjects.DatabaseDelete;
    data: {
        userId: string,
        pvcName: string,
        deploymentName: string,
        serviceName: string,
    }
}