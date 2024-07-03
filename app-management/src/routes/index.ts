import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";

const router = express.Router();

router.get('/api/applications/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const appConfig = await AppConfig.findById(req.params.id);
        if (!appConfig) {
            throw new Error("Missing database config");
        }
        const kubectlFun = new KubectlFun();
        appConfig.status = await kubectlFun.getPodStatus(appConfig.deploymentName);
        await appConfig.save();
        const appConfig2 = await AppConfig.findById(req.params.id);

        res.status(200).send(appConfig2);
    })

export {router as applicationConfigIndex};