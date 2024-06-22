import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@amtickets377/common";
import {body} from 'express-validator'
import {Order} from "../models/order";
import {DatabaseOrderType, DatabasePlans, OrderStatus} from "@cloud-wave/common";
import {DatabaseOrderCreateEventPublisher} from "../events/publisher/database-order-create-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();
router.post('/api/database/orders', requireAuth,[
    body('databaseOrderType')
        .not()
        .isEmpty()
        .withMessage('order must have databaseOrderType'),
    body('plan')
        .not()
        .isEmpty()
        .withMessage('order must have plan')

], validateRequest, async (req: Request, res: Response) => {
    const expirationDate = new Date();
    let price =0;
    if (req.body.plan =='Basic'){
        price = 15;
    }else if (req.body.plan =='Pro'){
        price = 115;
    }else {
        price = 240;
    }
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        databaseOrderType: req.body.databaseOrderType,
        price: price,
        plan: req.body.plan,
    });
    await order.save();
    await new DatabaseOrderCreateEventPublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        databaseOrderType: req.body.databaseOrderType,
        price: price,
        plan: req.body.plan
    });

    res.status(201).send(order);
})
