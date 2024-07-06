import express, {Request, Response} from "express";
import {requireAuth} from "@cloud-wave/common";
import axios from "axios";

const router = express.Router();
router.get('/api/applications/orders/repo', requireAuth, async (req: Request, res: Response) => {
    let githubToken = req.currentUser!.accessToken;
    console.log(githubToken);
    if (!githubToken) {
        console.error('GitHub token not found in environment variables');
        return res.status(400).send({ error: 'GitHub token not found in environment variables' });
    }
    const url = new URL('https://api.github.com/user/repos');
    url.searchParams.append('visibility', 'all'); // Fetch all repositories including private ones
    url.searchParams.append('affiliation', 'owner,collaborator,organization_member'); // Include repos where the user is owner, collaborator, or org member

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const data = await response.json();
    const repoFullNames = data.map((repo: any) => repo.full_name);
    console.log(repoFullNames);
    console.log('Repositories fetched successfully');
    res.status(201).send(repoFullNames);
});

export {router as getUserRepo};