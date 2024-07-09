import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {AppConfig} from "../models/app-config";

const router = express.Router();

router.get('/api/applications/management/:id', requireAuth
    , async (req: Request, res: Response) => {
        const appConfig = await AppConfig.findById(req.params.id);
        if (!appConfig) {
            console.log("not found");
            res.status(404).send("Not found");
        }
        const kubectlFun = new KubectlFun();
        // @ts-ignore
        appConfig.status = await kubectlFun.getPodStatus(appConfig.deploymentName);
        // @ts-ignore
        await appConfig.save();
        const appConfig2 = await AppConfig.findById(req.params.id);

        res.status(200).send(appConfig2);
    })

export {router as applicationConfigIndex};