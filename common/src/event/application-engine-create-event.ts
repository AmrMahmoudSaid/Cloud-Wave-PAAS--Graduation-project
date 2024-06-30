import {Subjects} from "./subjects";
export interface ApplicationEngineCreateEvent {
    subject: Subjects.ApplicationEngineCreate;

    data: {
        userId: string,
        namespace: string,
        deploymentName: string,
        applicationName: string,
        serviceName: string,
        gitUrl: string,
        path: string,
        plan: string
    }
}