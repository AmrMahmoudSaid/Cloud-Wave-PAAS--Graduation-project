import express, {Request, Response} from "express";
import {DatabaseConfig} from "../../models/database-config";
import {NotAuthorizedError, NotFound, requireAuth} from "@cloud-wave/common";
import {DatabaseDeletePublisher} from "../publishers/database-delete-publisher";
import {natsWrapper} from "../../nats-wrapper";

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
            pvcName: databaseConfig.pvcName
        })
        databaseConfig.status = "deleted"
        databaseConfig.save();
        res.status(201).send(databaseConfig);
    })

export {router as deleteDatabase};