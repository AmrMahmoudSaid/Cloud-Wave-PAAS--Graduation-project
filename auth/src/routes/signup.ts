import express,{Request , Response} from 'express';
import jwt from 'jsonwebtoken'
import {body} from "express-validator"
import {validateRequest, BadRequestError} from "@cloud-wave/common";
import {User} from "../models/user";
import {UserCreatedPublisher} from "../event/publisher/user-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import Stripe from "stripe";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20',
});
router.post('/api/users/signup',[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Error password format'),
    body('token').notEmpty().withMessage('You must provide a token'),
    ],validateRequest
    ,async (req: Request , res: Response) =>{

    const { email, password, name, token } = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser){
        throw new BadRequestError('Email in use');
    }
    const githubId = 0;
    const customer = await stripe.customers.create({
        email: req.body.email,
        source: token,
    });
    const user = User.build({email,name,password,githubId ,
        customerId: customer.id
    });
    await user.save();
        await new UserCreatedPublisher(natsWrapper.client).publish({
            name: user.name,
            email: user.email,
            id: user.id,
            userId: user.id,
            customerId: user.customerId,
        });
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        githubId: user.githubId,
        name: user.name
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(201).send(user);
});

export {router as signupRouter};