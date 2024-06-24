import {
    Listener,
    DatabaseDeleteEvent,
    Subjects,
    k8sAppsApi, k8sCoreApi
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";

export class DatabaseDeleteListener extends Listener<DatabaseDeleteEvent> {
    readonly subject = Subjects.DatabaseDelete
    queueGroupName = queueGroupName;
    async onMessage(data: DatabaseDeleteEvent['data'], msq: Message){
        await k8sAppsApi.deleteNamespacedDeployment(data.deploymentName,  'default');
        console.log(`Deployment ${data.deploymentName} deleted successfully.`);
        // Delete the PVC
        await k8sCoreApi.deleteNamespacedPersistentVolumeClaim(data.pvcName, 'default');
        console.log(`PVC ${data.pvcName} deleted successfully.`);
        msq.ack();
    }
}
