import express,{Request , Response} from 'express';
import jwt from 'jsonwebtoken'
import {body} from "express-validator"
import {validateRequest, BadRequestError} from "@cloud-wave/common";
import {User} from "../models/user";
import {UserCreatedPublisher} from "../event/publisher/user-created-publisher";
import {natsWrapper} from "../nats-wrapper";
const router = express.Router();

router.post('/api/users/signup',[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Error password format')
    ],validateRequest
    ,async (req: Request , res: Response) =>{

    const { email, password, name } = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser){
        throw new BadRequestError('Email in use');
    }
    const githubId = 0;
    const user = User.build({email,name,password,githubId});
    await user.save();

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        githubId: user.githubId
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(201).send(user);
});

export {router as signupRouter};