import express, {Request,Response} from 'express';
import {currentUser} from "@cloud-wave/common";
import {User} from "../models/user";
import {NotFound} from "@amtickets377/common";

const router = express.Router();

router.put('/api/users/update',currentUser,async (req:Request, res:Response) =>{
    const user = await User.findById(req.currentUser!.id);
    console.log(user);
    if (!user){
        throw new NotFound();
    }
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password != ""&&!req.body.password){
        user.password = req.body.password;
    }
    user.save();
    res.send({email:user.email, name: user.name});
});

export {router as updateUserRouter};