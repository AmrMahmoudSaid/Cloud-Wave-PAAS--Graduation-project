import {
    Listener,
    ApplicationDeleteEvent,
    Subjects,
    k8sAppsApi, k8sCoreApi
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";

export class AppDeleteListener extends Listener<ApplicationDeleteEvent> {
    readonly subject = Subjects.ApplicationDelete
    queueGroupName = queueGroupName;
    async onMessage(data: ApplicationDeleteEvent['data'], msq: Message){
        try{
            await k8sAppsApi.deleteNamespacedDeployment(data.deploymentName,  'default');
            console.log(`Deployment ${data.deploymentName} deleted successfully.`);
            await k8sCoreApi.deleteNamespacedService(data.serviceName, 'default');
            console.log(`Service ${data.deploymentName} deleted successfully.`);
            msq.ack();
        }catch (err){
            msq.ack();
            console.error(err);
        }
    }
}
