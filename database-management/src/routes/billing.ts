import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {DatabaseConfig} from "../models/database-config";

const router = express.Router();

router.get('/api/database/management/billing', requireAuth
    , async (req: Request, res: Response) => {
        const appConfig = await DatabaseConfig.find({
            userId: req.currentUser?.id
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