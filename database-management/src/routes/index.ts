import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {DatabaseConfig} from "../models/database-config";

const router = express.Router();

router.get('/api/database/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const databaseConfig = await DatabaseConfig.findById(req.params.id);
        if (!databaseConfig) {
            throw new Error("Missing database config");
        }
        const kubectlFun = new KubectlFun();
        databaseConfig.status = await kubectlFun.getPodStatus(databaseConfig.deploymentName);
        const loadBalancer = await kubectlFun.getExternalIP(databaseConfig.serviceName);
        if (loadBalancer){
            databaseConfig.host = loadBalancer;
        }
        await databaseConfig.save();
        const databaseConfig2 = await DatabaseConfig.findById(req.params.id);

        res.status(200).send(databaseConfig2);
    })

export {router as databaseConfigIndex};