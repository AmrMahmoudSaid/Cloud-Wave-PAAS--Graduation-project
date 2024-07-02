import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";

const router = express.Router();

router.get('/api/applications/management/show', requireAuth
    , async (req: Request, res: Response) => {
        const applicationConfig = await AppConfig.find({
            userId: req.currentUser?.id
        });
        const kubectlFun = new KubectlFun();
        if (Array.isArray(applicationConfig) && applicationConfig.length > 0) {
            // Iterate through the array and update the status
            applicationConfig.forEach(async config => {
                if (config.status!= "deleted" && config.status!="waiting"){
                    config.status = await kubectlFun.getPodStatus(config.deploymentName);

                }
                await config.save();
            });
        } else {
            console.log('No Application configurations found for the current user');
        }
        const databaseConfig2 = await AppConfig.find({
            userId: req.currentUser?.id
        });
        res.status(200).send(databaseConfig2);
    })

export {router as showApplicationConfig};