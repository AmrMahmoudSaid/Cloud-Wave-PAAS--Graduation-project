// import Stripe from 'stripe';
// import express from 'express';
//
//
// const stripe = new Stripe('sk_test_51PQFJ7LbsJuXkwVqA1D3KLGqUoDySxGLZiKjTE0cawJxSKxKjH9pdmVpCQ6o9mbEBoWZl8ab5L5p8ldZ6dft5izB00UZEI2Bpz', {
//     apiVersion: '2024-06-20',
// });
//
// const app = express();
// app.use(express.json());
//
// app.post('/create-checkout-session', async (req, res) => {
//     const successUrl = `${req.protocol}://${req.get('host')}/tmam`;
//     const cancelUrl = `${req.protocol}://${req.get('host')}/1`;
//
//     // Log URLs to debug
//     console.log('Success URL:', successUrl);
//     console.log('Cancel URL:', cancelUrl);
//
//     // Validate URLs
//     if (!successUrl.startsWith('http') || !cancelUrl.startsWith('http')) {
//     }
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         mode: 'subscription', // Set the mode to subscription
//         success_url: `https://dashboard.stripe.com/test/dashboard`,
//         cancel_url: `https://dashboard.stripe.com/test/dashboard`,
//         customer_email: "amrmahmoud@gmail.com",
//         client_reference_id: '123',
//         line_items: [{
//             price_data: {
//                 currency: 'usd',
//                 recurring: {
//                     interval: 'month' // Set the subscription interval (e.g., month, year)
//                 },
//                 unit_amount: 100 * 100,
//                 product_data: {
//                     name: ` Tour`,
//                     description: "tmam",
//                     images: [`https://www.natours.dev/img/tours/tour-1-cover.jpg`],
//                 },
//             },
//             quantity: 1
//         }],
//     });
//
//     res.status(200).json({
//         status: 'success',
//         session,
//     });
// });
// app.post('/cancel-subscription', (async (req, res, next) => {
//     const { subscriptionId } = req.body;
//
//     if (!subscriptionId) {
//         return res.status(400).json({ error: 'Subscription ID is required' });
//     }
//
//     try {
//         const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);
//
//         res.status(200).json({
//             status: 'success',
//             deletedSubscription,
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             status: 'error'
//         });
//     }
// }));
// app.get('/1', async (req, res) =>{
//     console.log("tmam");
// })
// app.listen(3000, () => console.log('Server is running on port 3000'));

import 'express-async-errors'
import {natsWrapper} from "./nats-wrapper";
import {UserCreatedListener} from "./events/listeners/user-created-listener";
import {DatabaseDeleteListener} from "./events/listeners/database-delete-listener";
import {DatabaseOrderCompletedListener} from "./events/listeners/database-order-completed";
import mongoose from "mongoose";
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
    if (!process.env.STRIPE_KEY){
        throw  new Error('STRIPE KEY doesnt exist');
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
        await mongoose.connect("mongodb://payment-mongo-srv:27017/auth");
        console.log("DB connection");
        new UserCreatedListener(natsWrapper.client).listen();
        new DatabaseDeleteListener(natsWrapper.client).listen();
        new DatabaseOrderCompletedListener(natsWrapper.client).listen();
    }catch (err){
        console.log(err);
    }
};
start().then(r =>
 console.log("Service payment started")
);
