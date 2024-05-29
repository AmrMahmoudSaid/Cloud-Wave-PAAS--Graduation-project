import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@cloud-wave/common';
import { User } from '../models/user';
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

router.post('/api/users/signup-git', async (req: Request, res: Response) => {
    const { code } = req.body;
    console.log(code);
    if (!code) {
        throw new BadRequestError('Authorization code is required');
    }

    // Step 1: Exchange authorization code for access token
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
    const user2 = User.build({email,name,password,githubId});
    await user2.save();
    const userJwt = jwt.sign({
        id: user2.id,
        email: user2.email
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(201).send(user);
});

export { router as signupGitRouter };
