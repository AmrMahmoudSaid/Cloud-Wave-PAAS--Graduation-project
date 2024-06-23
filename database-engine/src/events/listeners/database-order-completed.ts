import {
    Listener,
    DatabaseOrderCreateEvent,
    Subjects,
    DatabasePlanConfig,

} from "@cloud-wave/common";
import {IngressManager} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {
    hosts,
    IngressRule
} from "@cloud-wave/common";
import {createMySQLDeploymentAndServiceWithIngress} from "../../databases-deployment-config/mysql";
import {createMongoDBDeploymentAndService} from "../../databases-deployment-config/mongo";
import {createPostgreSQLDeploymentAndServiceWithIngress} from "../../databases-deployment-config/postgres";

export class DatabaseOrderCompletedEvent extends Listener<DatabaseOrderCreateEvent> {
    readonly subject = Subjects.DatabaseOrderCreate
    queueGroupName = queueGroupName;

    async onMessage(data: DatabaseOrderCreateEvent['data'], msq: Message){
        const name = generateRandomString();
        const path = generateRandomString();
        console.log(name);
        let storage='';
        let ram='';
        let cpu='';
        let port=3000;
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
            port = 3306;
            await createMySQLDeploymentAndServiceWithIngress(config);
        }else if(data.databaseOrderType==='postgres'){
            port = 5432;
            await createPostgreSQLDeploymentAndServiceWithIngress(config);
        }else if (data.databaseOrderType==='mongo'){
            port = 27017;
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
        console.log(`${name}-srv`)
        // await ingress.updateIngress(ingressRule);
        // console.log("tmam");
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