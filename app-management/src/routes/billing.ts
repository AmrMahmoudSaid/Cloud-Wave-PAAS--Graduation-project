import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";

const router = express.Router();

router.get('/api/applications/management/billing', requireAuth
    , async (req: Request, res: Response) => {
        const appConfig = await AppConfig.find({
            userId: req.currentUser?.id
        });
        let sum =0;
        for (const appConfig1 of appConfig) {
            if(appConfig1.plan=='Basic'){
                sum+=100;
            }else if(appConfig1.plan=='Pro'){
                sum+=200;
            }else {
                sum+=500;
            }
        }

        res.status(200).send({
            history: appConfig,
            total: sum
        });
    })

export {router as applicationBilling};