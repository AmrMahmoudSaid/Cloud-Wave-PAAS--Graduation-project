import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {KubectlFun} from "@cloud-wave/common";
import {DatabaseConfig} from "../../models/database-config";

const router = express.Router();

router.get('/api/database/management/show', requireAuth
    , async (req: Request, res: Response) => {
        const databaseConfig = await DatabaseConfig.find({
            userId: req.currentUser?.id
        });
        const kubectlFun = new KubectlFun();
        if (Array.isArray(databaseConfig) && databaseConfig.length > 0) {
            // Iterate through the array and update the status
            databaseConfig.forEach(async config => {
                if (config.status!= "deleted"){
                    config.status = await kubectlFun.getPodStatus(config.deploymentName);

                }
                await config.save();
            });
        } else {
            console.log('No database configurations found for the current user');
        }
        const databaseConfig2 = await DatabaseConfig.find({
            userId: req.currentUser?.id
        });
        res.status(200).send(databaseConfig2);
    })

export {router as showDatabaseConfig};