import {
    Listener,
    Subjects,
    ApplicationPaymentCompletedEvent,
    ApplicationPlanConfig,
    hosts, ApplicationDeploymentConfig,
    IngressManager,
    IngressRule
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import path from "path";
import {GitFun} from "../../application-deployment-config/git-fun";
import {Order} from "../../models/order-engine";
import {DockerFun} from "../../application-deployment-config/docker-fun";
import {createAppDeploymentAndService} from "../../application-deployment-config/app-depl-config";
import {AppEngineCreatePublisher} from "../publisher/app-engine-create-publisher";
import {natsWrapper} from "../../nats-wrapper";
export class AppPaymentCompletedListener extends Listener<ApplicationPaymentCompletedEvent> {
    readonly subject = Subjects.ApplicationPaymentCompleted
    queueGroupName = queueGroupName;
    async onMessage(data: ApplicationPaymentCompletedEvent['data'], msq: Message){
        try {
            const gitFun = new GitFun();
            const path1 =  path.join(__dirname, `repository/${data.applicationName}`);
            console.log(path1);
            await gitFun.cloneRepo(data.gitUrl,path1);
            const tag = '1';
            const dockerFun = new DockerFun();
            await dockerFun.buildDockerImage(path1,data.applicationName,tag);
            let storage='';
            let ram='';
            let cpu='';
            console.log(data.plan);
            if (data.plan=='Basic'){
                cpu = ApplicationPlanConfig.CPUBasic;
                ram = ApplicationPlanConfig.RAMBasic;
                storage = ApplicationPlanConfig.StorageBasic;
            }else if (data.plan =='Pro'){
                cpu = ApplicationPlanConfig.CPUPro;
                ram = ApplicationPlanConfig.RAMPro;
                storage = ApplicationPlanConfig.StoragePro;
            }else if (data.plan == 'Super'){
                cpu = ApplicationPlanConfig.CPUSuper;
                ram = ApplicationPlanConfig.RAMSuper;
                storage = ApplicationPlanConfig.StorageSuper;
            }
            const config: ApplicationDeploymentConfig = {
                imageName: `amrmahmoud377/${data.applicationName}:${tag}`,
                namespace: "default",
                deploymentName: `${data.applicationName}-depl`,
                serviceName: `${data.applicationName}-srv`,
                port: 3000,
                storageSize: `${storage}Gi`,
                memoryRequest: '512Mi',
                cpuRequest: '0.5',
                memoryLimit: `${ram}Gi`,
                cpuLimit: cpu,
                appName: data.applicationName,
                ingressHost: `/${hosts.Dev}`,
                ingressPath: `/${data.applicationName}`
            }
            console.log("Creating App Deployment")
            await createAppDeploymentAndService(config);
            console.log("Created Successfully")
            const ingressManager=new IngressManager();
            const ingress:IngressRule = {
                host: hosts.Dev,
                path: `/${data.applicationName}-path/?(.*)`,
                serviceName: config.serviceName,
                servicePort: config.port
            }
            const statices: IngressRule = {
                host: hosts.Dev,
                path: `/static/?(.*)`,
                serviceName: config.serviceName,
                servicePort: config.port
            }
            console.log(ingress);
            await ingressManager.updateIngress(ingress);
            await ingressManager.updateIngress(statices);
            const orderEngine =  Order.build({
                applicationName: data.applicationName,
                tag: tag,
                gitUrl: data.gitUrl,
                userId: data.userId,
                imageName: `amrmahmoud377/${data.applicationName}`
            })
            await new AppEngineCreatePublisher(natsWrapper.client).publish({
                userId: data.userId,
                applicationName: data.applicationName,
                gitUrl: data.gitUrl,
                deploymentName: `${data.applicationName}-depl`,
                serviceName: `${data.applicationName}-srv`,
                path: `${hosts.Dev}/${data.applicationName}-path`,
                namespace: 'default',
                plan: data.plan.toString()
            });
            msq.ack();

        }catch(error){
            throw new Error("Some thing want wrong try again later.")
        }
    }
}
