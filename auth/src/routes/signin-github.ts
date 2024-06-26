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

router.post('/api/users/login-git', async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
        throw new BadRequestError('Authorization code is required');
    }

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

    if (!accessToken) {
        throw new BadRequestError('No access token returned from GitHub');
    }

    // Step 2: Fetch user data from GitHub with access token
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
    if (!user) {
        throw new BadRequestError('User does not exist');
    }

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        githubId: user.githubId
    },process.env.JWT_KEY!);
    req.session ={
        jwt: userJwt
    };
    res.status(200).send(user);
});

export { router as loginGitRouter };
