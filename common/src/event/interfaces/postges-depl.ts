export interface PostgreSQLDeploymentConfig {
    namespace: string;
    deploymentName: string;
    serviceName: string;
    pvcName: string;
    storageSize: string;
    memoryRequest: string;
    memoryLimit: string;
    cpuRequest: string;
    cpuLimit: string;
    postgresPassword: string;
    databaseName: string;
    userName: string;
    userPassword: string;
    ingressHost: string;
    ingressPath: string;
}