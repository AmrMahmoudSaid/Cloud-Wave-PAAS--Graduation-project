import {
    Listener,
    ApplicationEngineCreateEvent,
    Subjects, k8sAppsApi,
    k8sCoreApi,
    hosts,
    KubectlFun
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {AppConfig} from "../../models/app-config";

export class ApplicationEngineCompletedListener extends Listener<ApplicationEngineCreateEvent> {
    readonly subject = Subjects.ApplicationEngineCreate
    queueGroupName = queueGroupName;

    async onMessage(data: ApplicationEngineCreateEvent['data'], msq: Message){
        const kubectlFun = new KubectlFun();
        console.log(data.deploymentName);
        console.log(data.serviceName);
        let podStatus = await kubectlFun.getPodStatus(data.deploymentName);
        let nodePort = await kubectlFun.getPodPort(data.serviceName);
        let loadBalancer = await kubectlFun.getExternalIP(data.serviceName);
        console.log(nodePort);
        if (!nodePort){
            nodePort = 'null'
        }
        if (!podStatus) {
            podStatus= 'null'
        }
        if (!loadBalancer) {
            loadBalancer = 'null';
        }
        const app = await AppConfig.findOne({applicationName:data.applicationName});
        if (app){
            app.namespace=data.namespace;
            app.serviceName= data.serviceName;
            app.nodePort=nodePort?.toString();
            app.status=podStatus;
            app.host=data.path;
            await app.save();
        }else {
            throw new Error("Could not find a deployment name");
        }
        msq.ack();
    }
}
