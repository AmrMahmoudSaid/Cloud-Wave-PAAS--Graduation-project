import {k8sAppsApi, k8sCoreApi} from "./kubctl-connection";

export class KubectlFun {
    private namespace: string  = 'default';
    private podStatus: string | undefined;
    private podPort: string | undefined
    async getPodStatus(deploymentName: string){
        const deploymentRes = await k8sAppsApi.readNamespacedDeployment(deploymentName, this.namespace);
        const selectorLabels = deploymentRes.body.spec!.selector.matchLabels;
        // @ts-ignore
        const labelSelector = Object.entries(selectorLabels).map(([key, value]) => `${key}=${value}`).join(',');
        const podsRes = await k8sCoreApi.listNamespacedPod(this.namespace
            , undefined, undefined, undefined, undefined, labelSelector);
        const podNames = podsRes.body.items.map(pod => pod.metadata!.name);
        const podName = podNames[0];
        const podRes = await k8sCoreApi.readNamespacedPod(podName!, this.namespace);
        this.podStatus = podRes.body.status!.phase?.toString();
        return this.podStatus;
    }
    getstatus(deploymentName: string){
        this.getPodStatus(deploymentName);
        return this.podStatus;
    }
    async getPodPort(serviceName: string){
        const svcRes = await k8sCoreApi.readNamespacedService(serviceName, this.namespace);
        this.podPort = svcRes.body.spec!.ports!.find(port => port.nodePort)?.nodePort?.toString();
    }
    getPort(serviceName: string){
        this.getPodPort(serviceName);
        return this.podPort;
    }
}

