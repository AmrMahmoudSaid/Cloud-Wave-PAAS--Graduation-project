import * as k8s from '@kubernetes/client-node';
import {IngressRule} from "./event/interfaces/ingress-rule";


export class IngressManager {
    private kc: k8s.KubeConfig;
    private networkingApi: k8s.NetworkingV1Api;

    constructor() {
        this.kc = new k8s.KubeConfig();
        const cluster = {
            caData: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJQXRBd1BBYUNCbDB3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBMk1qTXhNVFV4TWpsYUZ3MHpOREEyTWpFeE1UVTJNamxhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUM5aWVRcGRValRSTWY0WTZpV3kxd2xvMnhtMmlhT200UUIrZEFxanF3UE1YWVlxQjNsNzdDaXN1T08KSzNtd3ZnckJzcWhFek1mOXZGSnhpY2JNK2VqSGRrUVF1Rmk4Y2p0UzRKd1BNZlpucnN5MThIQVJ3M0tiYVczNgpVS0UzU2J5RUUvdzB1TWp0S0s5aFdKU3U1Z1FLbXhoeThPY0FsREkrRitjcUd6Z0VPWkpZTDk1cEYrOTNRWHdhCjVwZEhoNXRtL29SK0RrYVVLZkwxUE5hOVJ3VjlXd2VDMHdHZ3MxMENaSGZJajFEc0tYOHJDTVJWbzRyTnR1Si8KNkE2NmxxNHQvTllYQytUcTlwRW0vTUh0Ylp2RlBBcVdwT3UrWGVFeHVYLytPazFTVG9jUzZXU0RqdU1ldnJMTwpGbFlhUUZReDdFbm9mUUxEaUxGU0JJN2YvK0k1QWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJRdzRhRkhnTWVGVDFjdGhPaG1zTEZQeFY2Y3hEQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQWpPUEtGZ0xVMAp4ZDdOVEJuaXEyY3lVZGw2UnZwU0Z0UzJXUTYrZXVLc3NtQmZWYllhOVpoNGVBZVlhSHVMMzNoMkFQWjRLb1BWClJpUVdZb3F1Y1A4S1RkVVd5NVU5WUFQU2k1VlNicVNqQmo3bzZRSlFQNVVTbEM4THlYVlhXMFI2eFRGcXBpSmwKTWxWbTFCaVJQbDZxaXV5TEFKN0dFQjNKRTlxOXFoVElzb1JheUJVd05xTnBTWEs3Q3JNbTBuZXhjNW1ueDNkYwo0Vm0wVzF6UVhOUmZEVTNUeGVtYXNwZllLS1ZiOUpoY05Odm5tRWpud2Zab1B0ZUZJTm00ZkpRci9hdTVSRGFwCjZHN1BYbERza0phajF3MFQwa3A3WGtOakMrMGZPTFIxVUswajFLTFU0ZGRYUW8vL1c5M2czUVVPZWl4OFR5a3cKZmZmbDZmUEY2c3VGCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
            ,caFile: undefined,
            name: 'docker-desktop',
            server: 'https://kubernetes.docker.internal:6443',
            skipTLSVerify: false,
            tlsServerName: undefined
        }
        const user = {
            authProvider: undefined,
            certData: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURRakNDQWlxZ0F3SUJBZ0lJRitjTnhjR1V5Sk13RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TkRBMk1qTXhNVFV4TWpsYUZ3MHlOVEEyTWpNeE1UVTJNekphTURZeApGekFWQmdOVkJBb1REbk41YzNSbGJUcHRZWE4wWlhKek1Sc3dHUVlEVlFRREV4SmtiMk5yWlhJdFptOXlMV1JsCmMydDBiM0F3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRQ2lTeHFNbVY1TlBKZksKQTh4S2JMT0VveVFiOTNQcDVpdmZ4dXJKMUMxV1Zqb0M4dlpvamF2elNyU2kxU004OUFrQXVlL29vR3BSMG1lOQp4SXdISENKU051V3cxd2NQay9WODZ4bTU3MTVacGRIRTNvVklUaS95dFZMTGFJY0Q4U1VJWDVVb245RTFBK1VCCnpwTXBveXRJbmdCUktZNHpDU1ZoSG9FOXhrL1hHTmZHVGEraHpKUTkrUW51SGtqVjRrOHJoWVYxN01hRHVaRTgKVWI4QXJ2ZU5kUXdHQmtZemRmOVkwTHYwM1RCQWJxTEZCSXVLVkJRV21mYThpeHJNTkU4VmRBN1FBOEVGbTZISwovczk2MnliNWREeGF4aGFvLzJUSG5GbE1mdjJhUGdGN1lJRldnYXQ1ODVGaDlEa2hiSVpTVHEyQjV2bk5Bc2FoCmo0QnkxNE1mQWdNQkFBR2pkVEJ6TUE0R0ExVWREd0VCL3dRRUF3SUZvREFUQmdOVkhTVUVEREFLQmdnckJnRUYKQlFjREFqQU1CZ05WSFJNQkFmOEVBakFBTUI4R0ExVWRJd1FZTUJhQUZERGhvVWVBeDRWUFZ5MkU2R2F3c1UvRgpYcHpFTUIwR0ExVWRFUVFXTUJTQ0VtUnZZMnRsY2kxbWIzSXRaR1Z6YTNSdmNEQU5CZ2txaGtpRzl3MEJBUXNGCkFBT0NBUUVBU2FGbGZpYTdkNC8yYWFCSXdKbU1zZkFXQUZyUWlaYW5OcEZFellLZXNxR25HVjM1MEpiWFdrcTkKZll2STBxQ3dFL2RKUFFqeUd0citqRU5sNk9DdHJDczlEL1hFWVlqSVcrMVZQSkZJcW5wanNZRnI5RkRBL1NocgpuazI0YmZPbDNKTnp1LzdBMktmOFl3VFQyZFgwTTM0aXJjVW1SeEFZWnZuVEc2cmZVMnAyY01pQlkvTEpIemxrCnZDckJhcnR5SmZ4bldjL1UrdGMyYml2aXMvWmlSMnZDQzA0Q01Xam9SMmhTZkg3d3g0eTlBa3kvZzFRTnU1SXoKRnIyYXdzUVJZZ1c5dlJzSVZjdCsvWFVzM0JyUHJGZkFzQk1ZcWhGOHRWUW0zRDQwL3ZYWHVPVk14ZUxHSExPMgpNdFhXdVc5ZFB2aFg1NkFpSEdQaEZJOEpoZGg3T3c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
            certFile: undefined,
            keyData:"LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb2dJQkFBS0NBUUVBb2tzYWpKbGVUVHlYeWdQTVNteXpoS01rRy9kejZlWXIzOGJxeWRRdFZsWTZBdkwyCmFJMnI4MHEwb3RValBQUUpBTG52NktCcVVkSm52Y1NNQnh3aVVqYmxzTmNIRDVQMWZPc1p1ZTllV2FYUnhONkYKU0U0djhyVlN5MmlIQS9FbENGK1ZLSi9STlFQbEFjNlRLYU1yU0o0QVVTbU9Nd2tsWVI2QlBjWlAxeGpYeGsydgpvY3lVUGZrSjdoNUkxZUpQSzRXRmRlekdnN21SUEZHL0FLNzNqWFVNQmdaR00zWC9XTkM3OU4wd1FHNml4UVNMCmlsUVVGcG4ydklzYXpEUlBGWFFPMEFQQkJadWh5djdQZXRzbStYUThXc1lXcVA5a3g1eFpUSDc5bWo0QmUyQ0IKVm9HcmVmT1JZZlE1SVd5R1VrNnRnZWI1elFMR29ZK0FjdGVESHdJREFRQUJBb0lCQUdxMWZSQmpLemtYbFNvegoweGhBWHN6Z1E3Ykx2b0JWWWhXeUFlQ1F6UHFPbVhnazdsV1NpVFBmcytPNHhvR21aMkQ5NEx1UTlqYzBaQmZICmF0YWw3ZjhtcjJIV0VJTnlvcC92S1N3ek1sTTVqektscVBjQXlkQUkzeFoxZFFqbmZwVUIyOTRwTHZKdnpCeWoKQ2VuL3FrOEY3R2x4TEZsc014S25idzBDSHE3clQ2WTkvaThZUkNUNW8yaHg0dDJpRWs5cjZNNlJwc01aR3ZMLwpaRXc4aXlvTUVYSy9zeWpVQWExdWZ6cGtBS2wvbEh1K3Y5bTBBZncyampEVk15ZitOemtNOFBidC95RTBGK3FNCndVMCtkVDFucUVIenNlMlNpRkxuVGpYKzRhS2JKVHJFQUNoSUhHdnhsTk1NT1Z5aVRBRXRGd1h4QS9iZ2tZR20KNXEvSy9WRUNnWUVBejRrbHhYeWZpcUVaSnl2aHBCWk9WNW43dUkrbjNUank1UDE2NTRhMmtOc0I3bWh1MFdNQgpyOGp1eXkxTTd3SUxrRnVZQnhwb0hMcEpSVUpvOURqTy9VOXdqbnBWSEF0N0hKNHdVU2pUZFVwRHFhUUhWSUV2CjRTNjZxUXZPajQ5c0IydGxCSWVReHlrNjk2NXhzUkFPbVQ5WmtQTlYrckhUZHJ6dnE2cS8vc2NDZ1lFQXlERkoKd0dYYm9qcEFMZ2VXNGx2RzVKY2RrVU1CRUdjU3pLaVMySjZMSlRUeno1Q2ZLWWNoYlJMcm1qMG9GNndSRmw5YQpSL2ZHQkgwY25tWUQ0RGRpK0xNamJ3TUNOd2IvNm04aUNSVVljMVhTTnkyMDBlcElvMWZGZCt6U0d1dUdXQTlrCmtpY0RjblVVV09yd04xbDJRWnJDb3VlU3JhZ28yaDU1ZklzQ1lPa0NnWUFGR3M1L0NRMnpqenJiSjgwcENCTnQKUERCZzNjZTNQVXRjTG8veldmRHJwemRvOGRDbi9kTnd5M1IwTXUwTmcvTmMzYVBqcU5hZXZrWkhHZGNUQ3NLcwpvR09ZWFpIeVdxWHdra09GKzRjWC8zZWltSkpGbGRmanBnNlpVZDBHMHZSSlNtNzFxWS82RmgySk1oVkIwYTlLClBiQ3FUQkgxVktKcTdVTEg2aTlHeVFLQmdCbWdIWVd3UkNZRytOSXJqSWZiSWFGL0tueStxL015am5oK0Y1WDgKN1dqTTEyeTVZWFpLWXQvNGJRb29TK3FEendnakdvWmQxQTRkQ2IzSTV6UWJRdUw4NDB0QmdsWVM0azFhL210VgpOUFVHaGtzajRhS0JMOTBnemhra3lseEJ5OGVYNk5MQWhiTndBelBDbHc4dXQzRjhZdS9CWHNnMTMwelVXODZ5CmFKS0pBb0dBYVVJTWNjekNreVg3Z3EzZmhnNFhMZ1R5L1B1UjNLTXJhWFRxaTFVY3llWnhDNlc3ck5TWDF3b0wKZjVFYlRGMEJUczdBc2JNQXNjYmsrYlg5VFpIaW1USFdieDBLaE0xbTV4U2lHTmJZWGhSbWZjRnd4WVFjUVB2TApnRHUxVk05anZhOUFha1ZydUdjcFpIVkR6SlkyZVZOS1VrYThGVTQzaFNhb2Q2azE0MEE9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==",
            exec: undefined,
            keyFile: undefined,
            name: 'docker-desktop',
            token: undefined,
            password: undefined,
            username: undefined

        }
        this.kc.loadFromOptions({
            clusters: [cluster],
            users: [user],
            contexts: [{
                name: 'docker-desktop',
                cluster: 'docker-desktop',
                user: 'docker-desktop',
            }],
            currentContext: 'docker-desktop',
        });
        this.networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
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