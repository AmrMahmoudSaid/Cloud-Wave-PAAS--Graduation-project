import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';
import Docker from 'dockerode';
import { promisify } from 'util';
import { exec } from 'child_process';

export class GitFun {
    private docker;
    private execPromise;
    constructor() {
        this.docker = new Docker();
        this.execPromise = promisify(exec);
    }
    async cloneRepo(repoUrl: string, localPath: string) {
        const git = simpleGit();

        try {
            if (fs.existsSync(localPath)) {
                console.log('Directory already exists, pulling the latest changes...');
                await git.cwd(localPath).pull();
            } else {
                console.log('Cloning the repository...');
                await git.clone(repoUrl, localPath);
            }
            console.log(`Repository cloned to ${localPath}`);
        } catch (error) {
            console.error('Failed to clone repository:', error);
        }
    }

    getCurrentVersion(localPath: string): string | null {
        const packageJsonPath = path.join(localPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = require(packageJsonPath);
            return packageJson.version;
        }
        return null;
    }
}

