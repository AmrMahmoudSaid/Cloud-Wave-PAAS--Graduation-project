import express, {Request, Response} from "express";
import {DatabaseConfig} from "../models/database-config";
import {NotAuthorizedError, NotFound, requireAuth} from "@cloud-wave/common";
import {DatabaseDeletePublisher} from "../events/publishers/database-delete-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.delete('/api/database/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const id = req.params.id;
        const databaseConfig = await DatabaseConfig.findById(id);
        if (!databaseConfig) {
            throw new NotFound();
        }
        if (databaseConfig.userId != req.currentUser?.id){
            throw new NotAuthorizedError();
        }
        await new DatabaseDeletePublisher(natsWrapper.client).publish({
            userId: req.currentUser!.id,
            deploymentName: databaseConfig.deploymentName,
            pvcName: databaseConfig.pvcName,
            serviceName: databaseConfig.serviceName
        })
        databaseConfig.status = "deleted"
        const deletedConfig = await DatabaseConfig.findByIdAndDelete(id);
        res.status(201).send(deletedConfig);
    })
export {router as deleteDatabase};