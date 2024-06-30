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
    async buildDockerImage(repoPath: string, imageName: string, tag: string): Promise<void> {
        const docker = new Docker();
        console.log(tag)
        console.log(repoPath)
        const tarStream = await docker.buildImage({
            context: repoPath,
            src: ['Dockerfile'],

        }, {
            t: `${imageName}:${tag}`
        });
        tarStream.pipe(process.stdout);

        new Promise<void>((resolve, reject) => {
            tarStream.on('data', (data: Buffer) => {
                console.log(data.toString());
            });

            tarStream.on('end', () => {
                console.log(`Docker image ${imageName}:${tag} built successfully.`);
                resolve();
            });

            tarStream.on('error', (err: Error) => {
                console.error('Error building Docker image:', err);
                reject(err);
            });
        });
        await new Promise((resolve, reject) => {
            docker.modem.dial({
                method: 'POST',
                path: '/auth',
                options: {
                    username: 'amrmahmoud377',
                    password: '3mr_m7moud'
                }
            }, (err: any) => {
                if (err) reject(err);
                else resolve(undefined);
            });
        });
        console.log('Logged in to DockerHub');
        await docker.getImage(imageName).push({});
        console.log(`Docker image ${imageName} built and pushed successfully.`);
    }
     getCurrentVersion(localPath: string): string | null {
        const packageJsonPath = path.join(localPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = require(packageJsonPath);
            return packageJson.version;
        }
        return null;
    }
    async runOSCommand(command: string) {
        try {
            const { stdout, stderr } = await this.execPromise(command);
            console.log(`Command STDOUT: ${stdout}`);
            if (stderr) {
                console.error(`Command STDERR: ${stderr}`);
            }
        } catch (error: any) {
            console.error(`Error executing command: ${error.message}`);
        }
    }
}

