import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";
import {k8sAppsApi, k8sCoreApi} from "@cloud-wave/common";

const router = express.Router();

router.get('/api/applications/management/logs/:id', requireAuth
    , async (req: Request, res: Response) => {
        const kubectlFun = new KubectlFun();
        const pod = await AppConfig.findById(req.params.id);
        if (!pod) {
            throw new Error("Not Found");
        }
        const namespace ='default' ;
        let podName= "";
        let containerName ="";
        const pods = await k8sCoreApi.listNamespacedPod('default', undefined, undefined,
            undefined, undefined, `app=${pod.deploymentName}`);
        pods.body.items.forEach(pod => {
            // @ts-ignore
            console.log(`Pod: ${pod.metadata.name}`);
            // @ts-ignore
            podName =pod.metadata.name;
            // @ts-ignore
            pod.spec.containers.forEach(container => {
                console.log(`Container: ${container.name}`);
                containerName = container.name;
            });
        });

        const logOptions = {
            follow: true,
            tailLines: 100,
            timestamps: true
        };

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        let same='';
        const streamLogs = async () => {
            try {
                // @ts-ignore
                const response = await k8sCoreApi.readNamespacedPodLog(podName, namespace, containerName, logOptions);
                // @ts-ignore
                if (same==response.body){

                }else {
                    same= response.body;
                    const logs = response.body.trim().split('\n');
                    logs.forEach(log => {
                        res.write(`data: ${log}\n\n`);
                    });
                }
            } catch (error) {
                console.error('Error fetching pod logs:', error);
                res.write(`data: Error fetching pod logs\n\n`);
            }
        };

        res.write('\n');

        const interval = setInterval(streamLogs, 3000);

        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    })

export {router as showApplicationLogs};
