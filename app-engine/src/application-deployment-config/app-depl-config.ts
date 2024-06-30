import * as k8s from '@kubernetes/client-node';
import { appDeploymentConfig, k8sCoreApi, k8sAppsApi } from "@cloud-wave/common";

async function createAppDeploymentAndService(config: appDeploymentConfig): Promise<void> {
    const deploymentManifest: k8s.V1Deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: config.deploymentName
        },
        spec: {
            replicas: 1,
            selector: { matchLabels: { app: config.deploymentName } },
            template: {
                metadata: { labels: { app: config.deploymentName } },
                spec: {
                    containers: [
                        {
                            name: config.deploymentName,
                            image: config.imageName,
                            ports: [{ containerPort: 8080 }],
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
                        },
                    ]
                },
            },
        },
    };

    const serviceManifest: k8s.V1Service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: { name: config.serviceName },
        spec: {
            selector: { app: config.deploymentName },
            ports: [{ protocol: 'TCP', port: 80, targetPort: config.port }],
            type: 'ClusterIP',
        },
    };

    try {
        await k8sAppsApi.createNamespacedDeployment(config.namespace, deploymentManifest);
        console.log('Deployment created:', config.deploymentName);

        await k8sCoreApi.createNamespacedService(config.namespace, serviceManifest);
        console.log('Service created:', config.serviceName);
    } catch (err) {
        console.error('Error creating deployment and service:', err);
    }
}
