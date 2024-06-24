import {
    Listener,
    DatabaseEngineCreateEvent,
    Subjects, k8sAppsApi,
    k8sCoreApi,
    hosts,
    KubectlFun
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {DatabaseConfig} from "../../models/database-config";

export class DatabaseEngineCompletedListener extends Listener<DatabaseEngineCreateEvent> {
    readonly subject = Subjects.DatabaseEngineCreate
    queueGroupName = queueGroupName;

    async onMessage(data: DatabaseEngineCreateEvent['data'], msq: Message){
        const kubectlFun = new KubectlFun();
        let podStatus = await kubectlFun.getPodStatus(data.deploymentName);
        let nodePort = await kubectlFun.getPodPort(data.serviceName);
        console.log(nodePort);
        if (!nodePort){
            nodePort = 'null'
        }
        if (!podStatus) {
            podStatus= 'null'
        }
        const dataToSave = DatabaseConfig.build({
            userId: data.userId,
            namespace: data.namespace,
            pvcName: data.pvcName,
            deploymentName: data.deploymentName,
            rootPassword: data.rootPassword,
            databaseName: data.databaseName,
            databaseUsername: data.userName,
            databaseUsernamePass: data.userPassword,
            serviceName: data.serviceName,
            nodePort: nodePort?.toString(),
            status : podStatus,
            host: hosts.Dev,
        });
        await dataToSave.save();
        msq.ack();
    }
}
