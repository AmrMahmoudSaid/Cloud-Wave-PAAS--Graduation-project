export interface MongoDBDeploymentConfig {
    namespace: string;
    deploymentName: string;
    serviceName: string;
    imageName: string;
    port: number;
    pvcName: string;
    storageSize: string;
    memoryRequest: string;
    memoryLimit: string;
    cpuRequest: string;
    cpuLimit: string;
    rootPassword: string;
    databaseName: string;
    userName: string;
    userPassword: string;
    ingressHost: string;
    ingressPath: string;
}