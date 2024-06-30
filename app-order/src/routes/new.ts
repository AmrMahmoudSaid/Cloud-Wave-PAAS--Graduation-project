import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@amtickets377/common";
import {body} from 'express-validator'
import {Order} from "../models/order";
import {DatabaseOrderType, DatabasePlans, OrderStatus} from "@cloud-wave/common";
import {natsWrapper} from "../nats-wrapper";
import {ApplicationOrderCreatePublisher} from "../events/publisher/application-order-create-publisher";

const router = express.Router();
router.post('/api/applications/orders/new', requireAuth,[
    body('applicationOrderType')
        .not()
        .isEmpty()
        .withMessage('order must have applicationOrderType'),
    body('plan')
        .not()
        .isEmpty()
        .withMessage('order must have plan'),
    body('name')
        .not()
        .isEmpty()
        .withMessage('order must have name'),
    body('url')
        .not()
        .isEmpty()
        .withMessage('order must have git url')

], validateRequest, async (req: Request, res: Response) => {
    const expirationDate = new Date();
    let price =0;
    const orderWithSameName = await Order.findOne({
        applicationName: req.body.name
    })
    console.log(orderWithSameName)

    if (orderWithSameName){
        throw new Error("this name is not available")
    }
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.AwaitingPayment,
        expiresAt: expirationDate,
        applicationOrderType: req.body.applicationOrderType,
        price: price,
        plan: req.body.plan,
        applicationName: req.body.name,
        gitUrl: req.body.url,
    });
    await order.save();
    await new ApplicationOrderCreatePublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        databaseOrderType: req.body.databaseOrderType,
        price: price,
        plan: req.body.plan,
        applicationName: req.body.name,
        gitUrl: req.body.url,
        orderId: order.id
    });

    res.status(201).send(order);
})

export {router as createNewOrder};