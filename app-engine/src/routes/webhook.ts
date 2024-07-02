import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import {GitFun} from "../application-deployment-config/git-fun";
import path from "path";

const router = express.Router();

router.post('/api/applications/management/webhook', requireAuth
    , async (req: Request, res: Response) => {
        console.log('Received webhook:', req.body);
        const gitFun = new GitFun();

        if (req.body.repository) {
            try {
                const path1 =  path.join(__dirname, `repository/`);
                await gitFun.cloneRepo(req.body.repository.url,path1);
                res.status(200).send('Repository updated');
            } catch (error) {
                res.status(500).send('Failed to update repository');
            }
        } else {
            res.status(400).send('Invalid repository URL');
        }
    })

export {router as webhook};