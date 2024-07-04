import express, { Request, Response } from "express";
import { requireAuth } from "@cloud-wave/common";
import { KubectlFun } from "@cloud-wave/common";
import { AppConfig } from "../models/app-config";
import { k8sCoreApi, metricsClient } from "@cloud-wave/common"; // Assuming you have a Kubernetes metrics API client

const router = express.Router();

router.get('/api/applications/management/health/:id', requireAuth, async (req: Request, res: Response) => {
    const kubectlFun = new KubectlFun();
    const appConfig = await AppConfig.findById(req.params.id);
    if (!appConfig) {
        return res.status(404).send({ error: "Not Found" });
    }

    const namespace = 'default';
    const deploymentName = appConfig.deploymentName;

    try {
        // Fetch pod list
        const podsResponse = await k8sCoreApi.listNamespacedPod(namespace, undefined, undefined, undefined, undefined, `app=${deploymentName}`);
        const pods = podsResponse.body.items;

        // Fetch metrics for each pod
        const podHealthStatusPromises = pods.map(async (pod) => {
            // @ts-ignore
            const podName = pod.metadata.name;

            // Fetch CPU and memory metrics
            //@ts-ignore
            const metricsResponse = await metricsClient.getPodMetrics(namespace, podName);
            console.log(metricsResponse)
            //@ts-ignore
            const metrics = metricsResponse.body;

            // Calculate CPU and memory usage
            let cpuUsage = 0;
            let memoryUsage = 0;

            // Sum up usage from all containers in the pod
            //@ts-ignore
            metrics.containers.forEach(container => {
                cpuUsage += container.usage.cpu || 0;
                memoryUsage += container.usage.memory || 0;
            });

            // Convert memory to MB
            memoryUsage = memoryUsage / 1024 / 1024;

            return {
                podName,
                //@ts-ignore
                phase: pod.status.phase,
                //@ts-ignore
                conditions: pod.status.conditions,
                cpuUsage,
                memoryUsage
            };
        });

        const podHealthStatus = await Promise.all(podHealthStatusPromises);
        res.status(200).send(podHealthStatus);
    } catch (error) {
        console.error('Error fetching pod health:', error);
        res.status(500).send({ error: 'Error fetching pod health' });
    }
});

export { router as checkPodHealth };
