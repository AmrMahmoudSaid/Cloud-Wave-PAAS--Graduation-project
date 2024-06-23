import * as k8s from '@kubernetes/client-node';
import {IngressRule} from "./event/interfaces/ingress-rule";
import {networkingApi} from "./kubctl-connection";

export class IngressManager {
    private networkingApi: k8s.NetworkingV1Api;

    constructor() {
        this.networkingApi = networkingApi;
    }

    async updateIngress(rule: IngressRule) {
        const ingressName = 'ingress-srv';
        const namespace = 'default';

        try {
            const existingIngress = await this.networkingApi.readNamespacedIngress(ingressName, namespace);

            if (!existingIngress.body || !existingIngress.body.spec) {
                throw new Error(`Ingress '${ingressName}' not found in namespace '${namespace}' or missing spec`);
            }

            existingIngress.body.spec.rules = [
                {
                    host: rule.host,
                    http: {
                        paths: [
                            {
                                path: rule.path,
                                pathType: 'Prefix',
                                backend: {
                                    service: {
                                        name: rule.serviceName,
                                        port: {
                                            number: rule.servicePort,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            ];

            const updatedIngress = await this.networkingApi.replaceNamespacedIngress(ingressName, namespace, existingIngress.body);
            console.log('Ingress updated successfully:', updatedIngress.body.metadata?.name);
        } catch (err) {
            console.error('Error updating Ingress:', err);
        }
    }

    async deletePathFromIngress(pathToDelete: string) {
        const ingressName = 'ingress-srv';
        const namespace = 'default';

        try {
            const existingIngress = await this.networkingApi.readNamespacedIngress(ingressName, namespace);

            if (!existingIngress.body || !existingIngress.body.spec || !existingIngress.body.spec.rules) {
                throw new Error(`Ingress '${ingressName}' not found in namespace '${namespace}' or missing spec`);
            }


            const index = existingIngress.body.spec.rules[0]?.http?.paths.findIndex(
                path => path.path === pathToDelete
            );

            if (index === -1) {
                throw new Error(`Path '${pathToDelete}' not found in Ingress '${ingressName}'`);
            }

            // @ts-ignore
            existingIngress.body.spec.rules[0].http.paths.splice(index, 1);

            const updatedIngress = await this.networkingApi.replaceNamespacedIngress(ingressName, namespace, existingIngress.body);
            console.log('Path deleted successfully:', pathToDelete);
        } catch (err) {
            console.error('Error deleting path from Ingress:', err);
        }
    }
}