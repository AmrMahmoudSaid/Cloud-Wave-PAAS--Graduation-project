import {Listener, DatabaseOrderCreateEvent, Subjects, DatabasePlanConfig} from "@cloud-wave/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {
    MySQLDeploymentConfig,
    PostgreSQLDeploymentConfig,
    MongoDBDeploymentConfig
} from "@cloud-wave/common";
import * as k8s from '@kubernetes/client-node';

export class DatabaseOrderCompletedEvent extends Listener<DatabaseOrderCreateEvent> {
    readonly subject = Subjects.DatabaseOrderCreate
    queueGroupName = queueGroupName;
    async onMessage(data: DatabaseOrderCreateEvent['data'], msq: Message){
        let storage;
        let ram;
        let cpu;
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

    }
}

const createDatabaseConfig = (data: DatabaseOrderCreateEvent['data'], storage: string, ram: string, cpu: string) => {
    const name = `database-${data.databaseOrderType}-${data.userId}-${Date.now()}`;
    if (data.databaseOrderType== 'mysql'){
        const mysql : MySQLDeploymentConfig = {
            namespace: name,
            deploymentName: name,
            serviceName: name,
            pvcName: `${name}-pvc`,
            storageSize: storage,
            memoryRequest: "512m",
            memoryLimit: ram,
            cpuRequest: '',
            cpuLimit: cpu,
            mysqlRootPassword: 'data',
            databaseName: '',
            userName: '',
            userPassword: '',
            ingressHost: '',
            ingressPath: '/'
        }
    }else if (data.databaseOrderType== 'postgres'){
        const postgresql : PostgreSQLDeploymentConfig = {
            namespace: name,
            deploymentName: name,
            serviceName: name,
            pvcName: `${name}-pvc`,
            storageSize: storage,
            memoryRequest: "512m",
            memoryLimit: ram,
            cpuRequest: '',
            cpuLimit: cpu,
            postgresPassword: 'data',
            databaseName: '',
            userName: '',
            userPassword: '',
            ingressHost: '',
            ingressPath: '/'
        }

    }else if (data.databaseOrderType== 'mongo'){
        const mongos : MongoDBDeploymentConfig = {
            namespace: name,
            deploymentName: name,
            serviceName: name,
            pvcName: `${name}-pvc`,
            storageSize: storage,
            memoryRequest: "512m",
            memoryLimit: ram,
            cpuRequest: '',
            cpuLimit: cpu,
            mongoRootPassword: 'data',
            databaseName: '',
            userName: '',
            userPassword: '',
            ingressHost: '',
            ingressPath: '/'
        }

    }
}