export interface IngressRule {
    host: string;
    path: string;
    serviceName: string;
    servicePort: number;
}