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
        let podStatus = await kubectlFun.getPodStatus(data.deploymentName);
        // let nodePort = await kubectlFun.getPodPort(data.serviceName);
        // let loadBalancer = await kubectlFun.getExternalIP(data.serviceName);
        // if (!nodePort){
        //     nodePort = 'null'
        // }
        if (!podStatus) {
            podStatus= 'null'
        }
        // if (!loadBalancer) {
        //     loadBalancer = 'null';
        // }
        const app = await AppConfig.findOne({applicationName:data.applicationName});
        console.log(app);
        if (app!=null){
            app.namespace=data.namespace;
            app.serviceName= data.serviceName;
            app.nodePort="0";
            app.status=podStatus;
            app.host=data.path;
            app.deploymentName=data.deploymentName;
            await app.save();
        }else {
            throw new Error("Could not find a deployment name");
        }
        msq.ack();
    }
}
