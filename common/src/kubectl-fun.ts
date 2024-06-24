import {k8sAppsApi, k8sCoreApi} from "./kubctl-connection";

export class KubectlFun {
    private namespace: string  = 'default';
    async getPodStatus(deploymentName: string): Promise<string> {
        try {
            // Fetch deployment details
            const deploymentRes = await k8sAppsApi.readNamespacedDeployment(deploymentName, this.namespace);
            const selectorLabels = deploymentRes.body.spec!.selector.matchLabels;

            // @ts-ignore
            const labelSelector = Object.entries(selectorLabels)
                .map(([key, value]) => `${key}=${value}`)
                .join(',');

            // List pods using the label selector
            const podsRes = await k8sCoreApi.listNamespacedPod(this.namespace, undefined, undefined, undefined, undefined, labelSelector);
            const podNames = podsRes.body.items.map(pod => pod.metadata!.name);
            const podName = podNames[0];

            // Fetch the status of the first pod
            const podRes = await k8sCoreApi.readNamespacedPod(podName!, this.namespace);
            const podStatus = podRes.body.status!.phase?.toString();

            // Return the pod status
            return podStatus || "Unknown"; // Default to "Unknown" if status is not found
        } catch (error) {
            console.error('Error getting pod status:', error);
            throw new Error('Failed to get pod status');
        }
    }
    async getPodPort(serviceName: string): Promise<string | undefined> {
        try {
            const svcRes = await k8sCoreApi.readNamespacedService(serviceName, this.namespace);
            const podPort = svcRes.body.spec!.ports!.find(port => port.nodePort)?.nodePort?.toString();
            return podPort;
        } catch (error) {
            console.error('Error getting pod port:', error);
            throw new Error('Failed to get pod port');
        }
    }
}

