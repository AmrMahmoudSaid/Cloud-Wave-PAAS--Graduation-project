import {
    Listener,
    DatabaseOrderCreateEvent,
    Subjects,
    DatabasePlanConfig,
} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {
    hosts,
} from "@cloud-wave/common";
import {createMySQLDeploymentAndServiceWithIngress} from "../../databases-deployment-config/mysql";
import {createMongoDBDeploymentAndService} from "../../databases-deployment-config/mongo";
import {createPostgreSQLDeploymentAndServiceWithIngress} from "../../databases-deployment-config/postgres";
import {DatabaseEngineCreatePublisher} from "../publisher/database-engine-create-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class DatabaseOrderCompletedEvent extends Listener<DatabaseOrderCreateEvent> {
    readonly subject = Subjects.DatabaseOrderCreate
    queueGroupName = queueGroupName;

    async onMessage(data: DatabaseOrderCreateEvent['data'], msq: Message){
        const name = data.databaseOrderType+generateRandomString();
        // const path = generateRandomString();
        console.log(name);
        let storage='';
        let ram='';
        let cpu='';
        console.log(data.plan);
        if (data.plan=='Basic'){
            cpu = DatabasePlanConfig.CPUBasic;
            ram = DatabasePlanConfig.RAMBasic;
            storage = DatabasePlanConfig.StorageBasic;
        }else if (data.plan =='Pro'){
            cpu = DatabasePlanConfig.CPUPro;
            ram = DatabasePlanConfig.RAMPro;
            storage = DatabasePlanConfig.StoragePro;
        }else if (data.plan == 'Super'){
            cpu = DatabasePlanConfig.CPUSuper;
            ram = DatabasePlanConfig.RAMSuper;
            storage = DatabasePlanConfig.StorageSuper;
        }
        const config = {
            namespace: 'default',
            pvcName: `${name}-pvc`,
            storageSize: `${storage}Gi`,
            deploymentName: `${name}-depl`,
            rootPassword: `${data.rootPassword}`,
            databaseName: `${data.databaseName}`,
            userName: `${data.userName}`,
            userPassword: `${data.userPassword}`,
            serviceName: `${name}-srv`,
            memoryRequest: '512Mi',
            cpuRequest: '0.5',
            memoryLimit: `${ram}Gi`,
            cpuLimit: cpu,
            ingressHost: `/${hosts.Dev}`,
            ingressPath: "/amr"
        };
        if (data.databaseOrderType==='mysql'){
            await createMySQLDeploymentAndServiceWithIngress(config);
        }else if(data.databaseOrderType==='postgres'){
            await createPostgreSQLDeploymentAndServiceWithIngress(config);
        }else if (data.databaseOrderType==='mongo'){
            await createMongoDBDeploymentAndService(config);
        }
        console.log('tmam');
        // const ingress = new IngressManager();
        // const ingressRule : IngressRule ={
        //     host: hosts.Dev,
        //     path: `/${path}`,
        //     serviceName: `${name}-srv`,
        //     servicePort: port
        // }
        await new DatabaseEngineCreatePublisher(natsWrapper.client).publish({
            namespace: 'default',
            pvcName: `${name}-pvc`,
            deploymentName: `${name}-depl`,
            rootPassword: `${data.rootPassword}`,
            databaseName: `${data.databaseName}`,
            userName: `${data.userName}`,
            userPassword: `${data.userPassword}`,
            serviceName: `${name}-srv`,
        })
        msq.ack();
    }
}

function generateRandomString(length: number = 26): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz-';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}