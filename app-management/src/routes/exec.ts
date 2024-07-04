import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";
import {k8sAppsApi, k8sCoreApi,exec } from "@cloud-wave/common";
import { WebSocketServer } from 'ws';
const { createServer } = require('http');
import {app} from "../app";
// const exec = new k8s.Exec(kc);
const server = new createServer(app); // Correct instantiation
const wss = new WebSocketServer({ server });
const router = express.Router();

router.get('/api/applications/management/exec/:id', requireAuth
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

        res.send({ podName, containerName }); // Respond with pod and container details

    });

wss.on('connection', async (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost'); // Assuming localhost, adjust if needed
    const id = url.searchParams.get('id');
    if (!id) {
        ws.close();
        return;
    }

    const pod = await AppConfig.findById(id);
    if (!pod) {
        ws.close();
        return;
    }

    const namespace = 'default';
    let podName = "";
    let containerName = "";
    const pods = await k8sCoreApi.listNamespacedPod('default', undefined, undefined, undefined, undefined, `app=${pod.deploymentName}`);
    pods.body.items.forEach(pod => {
        // @ts-ignore
        podName = pod.metadata.name;
        // @ts-ignore
        pod.spec.containers.forEach(container => {
            containerName = container.name;
        });
    });

    try {
        exec.exec(
            namespace,
            podName,
            containerName,
            ['/bin/sh'],
            ws as any, // stdin
            ws as any, // stdout
            ws as any, // stderr
            true, // tty
            (status) => {
                console.log('Stream status:', status);
                ws.close();
            }
        );

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });

    } catch (error) {
        console.error('Error during exec:', error);
        ws.close();
    }
});


export {router as showApplicationLogs};
