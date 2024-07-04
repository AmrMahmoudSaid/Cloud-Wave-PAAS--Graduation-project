import {Subjects} from "./subjects";
export interface DatabaseEngineCreateEvent {
    subject: Subjects.DatabaseEngineCreate;

    data: {
        userId: string,
        namespace: string,
        pvcName: string,
        deploymentName: string,
        rootPassword: string,
        databaseName: string,
        userName: string,
        userPassword: string,
        serviceName: string,
        price: string;
    }
}