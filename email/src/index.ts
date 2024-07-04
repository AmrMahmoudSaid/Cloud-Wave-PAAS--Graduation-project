import 'express-async-errors'
import {natsWrapper} from "./nats-wrapper";
import {UserCreatedListener} from "./event/listeners/user-created-listener";
import {PaymentCompletedListener} from "./event/listeners/payment-completed-listener";
import {AppPaymentCompletedListener} from "./event/listeners/app-payment-completed-listener";
const start = async () => {
    if (!process.env.NATS_URL){
        throw  new Error('NATS_URL doesnt exist');
    }
    if (!process.env.NATS_CLUSTER_ID){
        throw  new Error('NATS_CLUSTER_ID doesnt exist');
    }
    if (!process.env.NATS_CLIENT_ID){
        throw  new Error('NATS_CLIENT_ID doesnt exist');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close',()=>{
            console.log('nats connection closed!');
        });
        process.on('SIGTERM', ()=> natsWrapper.client.close());
        process.on('SIGINT', ()=> natsWrapper.client.close());
        new UserCreatedListener(natsWrapper.client).listen();
        new PaymentCompletedListener(natsWrapper.client).listen();
        new AppPaymentCompletedListener(natsWrapper.client).listen();
    }catch (err){
        console.log(err);
    }
};
start();
// import * as k8s from '@kubernetes/client-node';
//
//
// const kc = new k8s.KubeConfig();
// kc.loadFromDefault();
//
// console.log(kc.clusters[0])
// console.log(kc.users[0])


