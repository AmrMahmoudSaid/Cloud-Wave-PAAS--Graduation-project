import 'express-async-errors'
import mongoose from 'mongoose';
import {natsWrapper} from "./nats-wrapper";
import {AppDeleteListener} from "./events/listeners/app-delete-listener";
import {AppPaymentCompletedListener} from "./events/listeners/app-payment-completed-listener";

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
        await mongoose.connect("mongodb://app-engine-db-mongo-srv:27017/app-engine");
        // await mongoose.connect('mongodb://localhost:27017/app' );
        console.log("DB connection");
        new AppDeleteListener(natsWrapper.client).listen();
        new AppPaymentCompletedListener(natsWrapper.client).listen();
    }catch (err){
        console.log(err);
    }
};
start();

