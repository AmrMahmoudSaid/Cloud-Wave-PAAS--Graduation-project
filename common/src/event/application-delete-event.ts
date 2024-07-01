import {Subjects} from "./subjects";
export interface ApplicationDeleteEvent {
    subject: Subjects.ApplicationDelete;
    data: {
        applicationName: string;
        userId: string,
        deploymentName: string,
        serviceName: string,
    }
}