import * as k8s from '@kubernetes/client-node';
import {MySQLDeploymentConfig} from "@cloud-wave/common";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);



async function createMySQLDeploymentAndServiceWithIngress(config: MySQLDeploymentConfig) {
    const pvcManifest: k8s.V1PersistentVolumeClaim = {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: { name: config.pvcName },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: { requests: { storage: config.storageSize } },
        },
    };

    // Define Deployment manifest
    const deploymentManifest: k8s.V1Deployment = {
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
                        image: 'mysql:latest', // Replace with desired MySQL image version
                        ports: [{ containerPort: 3306 }],
                        env: [{
                            name: 'MYSQL_ROOT_PASSWORD',
                            value: config.mysqlRootPassword
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

    const serviceManifest: k8s.V1Service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: { name: config.serviceName },
        spec: {
            selector: { app: config.deploymentName },
            ports: [{ protocol: 'TCP', port: 3306, targetPort: 3306 }],
            type: 'ClusterIP'  // Change to 'NodePort' or 'LoadBalancer' as needed
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
        console.error('Error creating PVC, deployment, service, or ingress:', err);
    }
}