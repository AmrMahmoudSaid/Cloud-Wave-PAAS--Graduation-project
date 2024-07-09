import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";
import mongoose, {Schema} from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.get('/api/applications/management/billing', requireAuth
    , async (req: Request, res: Response) => {
        try {
            //     return res.status(400).send({ error: 'Invalid user ID' });
            // }
            console.log(req.currentUser);
            console.log(req.currentUser?.id);
            console.log(req.currentUser?.id);
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

        }catch(err){
            console.log(err);
        }
    })

export {router as applicationBilling};