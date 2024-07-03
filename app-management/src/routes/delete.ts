import express, {Request, Response} from "express";
import {AppConfig} from "../models/app-config";
import {NotAuthorizedError, NotFound, requireAuth} from "@cloud-wave/common";
import {AppDeletePublisher} from "../events/publishers/app-delete-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.delete('/api/applications/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const id = req.params.id;
        const appConfig = await AppConfig.findById(id);
        if (!appConfig) {
            throw new NotFound();
        }
        if (appConfig.userId != req.currentUser?.id){
            throw new NotAuthorizedError();
        }
        await new AppDeletePublisher(natsWrapper.client).publish({
            userId: req.currentUser!.id,
            deploymentName: appConfig.deploymentName,
            serviceName: appConfig.serviceName,
            applicationName: appConfig.applicationName
        })
        appConfig.status = "deleted"
        const app = await AppConfig.findByIdAndDelete(id);
        res.status(200).send(app);
    })

export {router as deleteDatabase};