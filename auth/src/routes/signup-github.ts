import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@cloud-wave/common';
import { User } from '../models/user';
import Stripe from "stripe";
import {UserCreatedPublisher} from "../event/publisher/user-created-publisher";
import {natsWrapper} from "../nats-wrapper";
const router = express.Router();

const CLIENT_ID = 'Ov23liAiGPUlEm4xMIgH';
const CLIENT_SECRET = 'b97ca29889120618e7af316d722517f5ab0c1138';
interface GitHubTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
}

interface GitHubUserResponse {
    id: number;
    login: string;
    email: string | null;
}
const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2024-06-20',
});
router.post('/api/users/signup-git', [
    body('token').notEmpty().withMessage('You must provide a token'),
    body('code').notEmpty().withMessage('You must provide a code'),
],validateRequest,async (req: Request, res: Response) => {
    const { code, token } = req.body;
    console.log(code);
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
        }),
    });

    if (!tokenResponse.ok) {
        throw new BadRequestError('Failed to exchange authorization code for access token');
    }
    const tokenData: GitHubTokenResponse = await tokenResponse.json() as GitHubTokenResponse;
    const accessToken = tokenData.access_token;
    console.log(accessToken)
    if (!accessToken) {
        throw new BadRequestError('No access token returned from GitHub');
    }

    const userResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!userResponse.ok) {
        throw new BadRequestError('Failed to fetch user data from GitHub');
    }

    const userData: GitHubUserResponse = await userResponse.json() as GitHubUserResponse;
    console.log(userData);

    let user = await User.findOne({ githubId: userData.id });
    if (user) {
        throw new BadRequestError('User already exists');
    }
    console.log(userData.id,userData.login);
    let email = userData.login;
    if (email==null) {
        email = "null";
    }
    const name = userData.login;
    let githubId: number = userData.id;
    if (githubId==null){
        githubId = 0;
    }
    const password = "null"
    const customer = await stripe.customers.create({
        email: req.body.email,
        source: token,
    });
    const user2 = User.build({email,name,password,githubId,
        customerId: customer.id
    });
    await user2.save();
    await new UserCreatedPublisher(natsWrapper.client).publish({
        name: user2.name,
        email: user2.email,
        id: user2.id,
        userId: user2.id,
        customerId: user2.customerId,
    });
    const userJwt = jwt.sign({
        id: user2.id,
        email: user2.email,
        githubId: user2.githubId,
        accessToken,
        name: user2.name
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(201).send(user);
});

export { router as signupGitRouter };
