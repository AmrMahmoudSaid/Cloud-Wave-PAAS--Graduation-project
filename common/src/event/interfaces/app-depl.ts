export interface ApplicationDeploymentConfig {
    namespace: string;
    deploymentName: string;
    serviceName: string;
    imageName: string;
    port: number;
    storageSize: string;
    memoryRequest: string;
    memoryLimit: string;
    cpuRequest: string;
    cpuLimit: string;
    appName: string;
    ingressHost: string;
    ingressPath: string;
}