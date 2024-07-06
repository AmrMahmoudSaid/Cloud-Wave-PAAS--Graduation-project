import {AppConfig} from "./models/app-config";
import {k8sCoreApi} from "@cloud-wave/common";

const { KubeConfig, CoreV1Api, Exec } = require('@kubernetes/client-node');
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require("cookie-session");
const { json } = require("body-parser");
const { NotFound, errorHandler, currentUser } = require("@cloud-wave/common");
const { natsWrapper } = require("./nats-wrapper");
const { ApplicationEngineCompletedListener } = require("./events/listeners/application-engine-completed-listener");
const { AppPaymentCompletedListener } = require("./events/listeners/app-payment-completed-listener");
const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const { appExec } = require("./routes/exec");
const { showApplicationLogs } = require("./routes/logs");
const { showApplicationConfig } = require("./routes/show");
const { deleteDatabase } = require("./routes/delete");
const { applicationConfigIndex } = require("./routes");
const { checkPodHealth } = require("./routes/health");
const { applicationBilling } = require("./routes/billing");

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    // secure: true, uncomment in production if HTTPS is enabled
}));
app.use(currentUser);

app.use(showApplicationLogs);
app.use(showApplicationConfig);
app.use(deleteDatabase);
app.use(applicationConfigIndex);
app.use(checkPodHealth);
app.use(applicationBilling);
app.use(appExec);

app.all('*', () => { throw new NotFound(); });
app.use(errorHandler);

const server = createServer(app);
const wss = new WebSocketServer({ server });

const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY does not exist');
    if (!process.env.MONGO_UR) throw new Error('MONGO_URI does not exist');
    if (!process.env.NATS_URL) throw new Error('NATS_URL does not exist');
    if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID does not exist');
    if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID does not exist');

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => console.log('NATS connection closed!'));
        process.on('SIGTERM', () => natsWrapper.client.close());
        process.on('SIGINT', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_UR);
        console.log("DB connection successful");

        new ApplicationEngineCompletedListener(natsWrapper.client).listen();
        new AppPaymentCompletedListener(natsWrapper.client).listen();
    } catch (err) {
        console.error("Startup error:", err);
    }
};

server.listen(4000, () => {
    console.log('Listening on port 4000');
});
start();

wss.on('connection', async (ws:any, req: any) => {
    console.log("WebSocket connection established");

    const url = new URL(req.url || '', 'http://localhost'); // Adjust if needed
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
        const kc = new KubeConfig();
        kc.loadFromDefault();
        const k8sExec = new Exec(kc);

        k8sExec.exec(
            namespace,
            podName,
            containerName,
            '/bin/sh',
            process.stdout,
            process.stderr,
            ws,
            true,
            (status: any) => {
                console.log('Stream status:', status);
                // ws.close();
            }
        );

        ws.on('message', (message: any) => {
            console.log(`Received message: ${message}`);
            if (message === 'exit') {
                ws.close(); // Close the WebSocket connection
            } else {
                ws.send(message); // Echo back the received message
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });

    } catch (error) {
        console.error('Error during exec:', error);
        ws.close();
    }
});