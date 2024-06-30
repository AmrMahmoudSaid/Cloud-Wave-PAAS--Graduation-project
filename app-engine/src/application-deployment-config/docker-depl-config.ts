import * as fs from 'fs-extra';
import * as path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import Docker from 'dockerode';
import * as k8s from '@kubernetes/client-node';

interface DockerDeploymentConfig {
    repoUrl: string;
    localPath: string;
    imageName: string;
    namespace: string;
    deploymentName: string;
    serviceName: string;
    pvcName: string;
    storageSize: string;
    memoryRequest: string;
    cpuRequest: string;
    memoryLimit: string;
    cpuLimit: string;
    port: number;
}

async function createDockerDeploymentAndService(config: DockerDeploymentConfig): Promise<void> {
    const git = simpleGit();
    const docker = new Docker();
    const k8sCoreApi = new k8s.CoreV1Api();
    const k8sAppsApi = new k8s.AppsV1Api();
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromDefault();

    const cloneOrUpdateRepo = async (repoUrl: string, localPath: string): Promise<void> => {
        if (fs.existsSync(localPath)) {
            console.log('Directory already exists, pulling latest changes...');
            await git.cwd(localPath).pull();
        } else {
            console.log('Cloning repository...');
            await git.clone(repoUrl, localPath);
        }
    };

    const buildAndPushDockerImage = async (localPath: string, imageName: string): Promise<void> => {
        const stream = await docker.buildImage(
            {
                context: localPath,
                src: ['Dockerfile'],
            },
            { t: imageName }
        );

        await new Promise((resolve, reject) => {
            stream.on('data', (data: any) => console.log(data.toString()));
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        await docker.getImage(imageName).push({});

        console.log(`Docker image ${imageName} built and pushed successfully.`);
    };


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
                            volumeMounts: [
                                { mountPath: '/data', name: 'app-storage' },
                            ],
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
        await cloneOrUpdateRepo(config.repoUrl, config.localPath);
        await buildAndPushDockerImage(config.localPath, config.imageName);

        await k8sAppsApi.createNamespacedDeployment(config.namespace, deploymentManifest);
        console.log('Deployment created:', config.deploymentName);

        await k8sCoreApi.createNamespacedService(config.namespace, serviceManifest);
        console.log('Service created:', config.serviceName);
    } catch (err) {
        console.error('Error creating deployment and service:', err);
    }
}

