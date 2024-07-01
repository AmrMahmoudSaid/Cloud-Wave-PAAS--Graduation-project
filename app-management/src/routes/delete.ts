import express, {Request, Response} from "express";
import {AppConfig} from "../models/app-config";
import {NotAuthorizedError, NotFound, requireAuth} from "@cloud-wave/common";
import {AppDeletePublisher} from "../events/publishers/app-delete-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.delete('/api/applications/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const id = req.params.id;
        const databaseConfig = await AppConfig.findById(id);
        if (!databaseConfig) {
            throw new NotFound();
        }
        if (databaseConfig.userId != req.currentUser?.id){
            throw new NotAuthorizedError();
        }
        await new AppDeletePublisher(natsWrapper.client).publish({
            userId: req.currentUser!.id,
            deploymentName: databaseConfig.deploymentName,
            serviceName: databaseConfig.serviceName,
            applicationName: databaseConfig.applicationName
        })
        databaseConfig.status = "deleted"
        databaseConfig.save();
        res.status(200).send(databaseConfig);
    })

export {router as deleteDatabase};