import * as k8s from '@kubernetes/client-node';
import {MySQLDeploymentConfig, k8sCoreApi, k8sAppsApi} from "@cloud-wave/common";


export async function createMySQLDeploymentAndServiceWithIngress(config: MySQLDeploymentConfig) {
    const pvcManifest = {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: { name: config.pvcName },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: { requests: { storage: config.storageSize } },
        },
    };
    console.log("amr")
    const deploymentManifest= {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: { name: config.deploymentName },
        spec: {
            replicas: 1,
            selector: { matchLabels: { app: config.deploymentName } },
            template: {
                metadata: { labels: { app: config.deploymentName } },
                spec: {
                    containers: [{
                        name: config.deploymentName,
                        image: 'mysql',
                        ports: [{ containerPort: 3306 }],
                        env: [{
                            name: 'MYSQL_ROOT_PASSWORD',
                            value: config.rootPassword
                        }, {
                            name: 'MYSQL_DATABASE',
                            value: config.databaseName
                        }, {
                            name: 'MYSQL_USER',
                            value: config.userName
                        }, {
                            name: 'MYSQL_PASSWORD',
                            value: config.userPassword
                        }],
                        resources: {
                            requests: { memory: config.memoryRequest, cpu: config.cpuRequest },
                            limits: { memory: config.memoryLimit, cpu: config.cpuLimit }
                        },
                        volumeMounts: [{ mountPath: '/var/lib/mysql', name: 'mysql-storage' }]
                    }],
                    volumes: [{
                        name: 'mysql-storage',
                        persistentVolumeClaim: { claimName: config.pvcName }
                    }]
                }
            }
        }
    };
    console.log("mahmoud")
    const serviceManifest = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: { name: config.serviceName },
        spec: {
            selector: { app: config.deploymentName },
            ports: [{ protocol: 'TCP', port: 3306, targetPort: 3306 }],
            type: 'NodePort'
        }
    };

    try {

        await k8sCoreApi.createNamespacedPersistentVolumeClaim(config.namespace, pvcManifest);
        console.log('Persistent Volume Claim created:', config.pvcName);

        await k8sAppsApi.createNamespacedDeployment(config.namespace, deploymentManifest);
        console.log('Deployment created:', config.deploymentName);

        await k8sCoreApi.createNamespacedService(config.namespace, serviceManifest);
        console.log('Service created:', config.serviceName);
    } catch (err) {
        console.error('Error creating PVC, deployment, or service:', err);
    }
}