import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {DatabaseConfig} from "../models/database-config";
import mongoose, {Schema} from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.get('/api/database/management/billing', requireAuth
    , async (req: Request, res: Response) => {
        // @ts-ignore
        if (!ObjectId.isValid(req.currentUser?.id)) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        // @ts-ignore
        const userId = new ObjectId(req.currentUser.id);

        const appConfig = await DatabaseConfig.find({
            userId: userId
        });
        let sum =0;
        for (const appConfig1 of appConfig) {
           sum += appConfig1.price;
        }

        res.status(200).send({
            history: appConfig,
            total: sum
        });
    })

export {router as databaseBilling};