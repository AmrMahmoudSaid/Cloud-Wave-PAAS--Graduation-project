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

            // Check if rules array exists, if not, initialize it
            if (!existingIngress.body.spec.rules) {
                existingIngress.body.spec.rules = [];
            }

            // Find the existing rule for the host
            const existingRuleIndex = existingIngress.body.spec.rules.findIndex(r => r.host === rule.host);

            if (existingRuleIndex === -1) {
                // If the rule for the host does not exist, add a new rule
                existingIngress.body.spec.rules.push({
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
                });
            } else {
                // @ts-ignore
                existingIngress.body.spec.rules[existingRuleIndex].http.paths.push({
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
                });
            }

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