import * as k8s from '@kubernetes/client-node';
import {MongoDBDeploymentConfig} from "@cloud-wave/common";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

async function createMongoDBDeploymentAndService(config: MongoDBDeploymentConfig) {
    // Define the Persistent Volume Claim manifest
    const pvcManifest: k8s.V1PersistentVolumeClaim = {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
            name: config.pvcName,
        },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
                requests: {
                    storage: config.storageSize,
                },
            },
        },
    };

    // Define the Deployment manifest
    const deploymentManifest: k8s.V1Deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: config.deploymentName,
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: config.deploymentName,
                },
            },
            template: {
                metadata: {
                    labels: {
                        app: config.deploymentName,
                    },
                },
                spec: {
                    containers: [
                        {
                            name: config.deploymentName,
                            image: 'mongo:4.4',
                            ports: [
                                {
                                    containerPort: 27017,
                                },
                            ],
                            env: [
                                {
                                    name: 'MONGO_INITDB_ROOT_USERNAME',
                                    value: 'root',
                                },
                                {
                                    name: 'MONGO_INITDB_ROOT_PASSWORD',
                                    value: config.mongoRootPassword,
                                },
                                {
                                    name: 'MONGO_INITDB_DATABASE',
                                    value: config.databaseName,
                                },
                            ],
                            resources: {
                                requests: {
                                    memory: config.memoryRequest,
                                    cpu: config.cpuRequest,
                                },
                                limits: {
                                    memory: config.memoryLimit,
                                    cpu: config.cpuLimit,
                                },
                            },
                            volumeMounts: [
                                {
                                    mountPath: '/data/db',
                                    name: 'mongo-storage',
                                },
                            ],
                        },
                    ],
                    volumes: [
                        {
                            name: 'mongo-storage',
                            persistentVolumeClaim: {
                                claimName: config.pvcName,
                            },
                        },
                    ],
                },
            },
        },
    };

    // Define the Service manifest
    const serviceManifest: k8s.V1Service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name: config.serviceName,
        },
        spec: {
            selector: {
                app: config.deploymentName,
            },
            ports: [
                {
                    protocol: 'TCP',
                    port: 27017,
                    targetPort: 27017,
                },
            ],
            type: 'LoadBalancer',
        },
    };
    try {
        // Create Persistent Volume Claim
        await k8sCoreApi.createNamespacedPersistentVolumeClaim(config.namespace, pvcManifest);
        console.log('Persistent Volume Claim created:', config.pvcName);

        // Create Deployment
        await k8sAppsApi.createNamespacedDeployment(config.namespace, deploymentManifest);
        console.log('Deployment created:', config.deploymentName);

        // Create Service
        await k8sCoreApi.createNamespacedService(config.namespace, serviceManifest);
        console.log('Service created:', config.serviceName);

    } catch (err) {
        console.error('Error creating PVC, deployment, service, or ingress:', err);
    }
}