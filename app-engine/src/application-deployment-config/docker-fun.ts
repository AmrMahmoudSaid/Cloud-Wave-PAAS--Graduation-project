import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

export class DockerFun {
    private git;
    private execAsync
    constructor() {

        this.git = simpleGit();
        this.execAsync = promisify(exec);
    }

    async  delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
    }

    async  executeCommand(command: string) {
            try {
                    const { stdout, stderr } = await this.execAsync(command,{ maxBuffer: 1024 * 1024 * 10 });
                    console.log('stdout:', stdout);
                    console.error('stderr:', stderr);
            } catch (error) {
                    console.error('Error executing command:', error);
            }
    }

    async buildDockerImage(repoPath: string, imageName: string, tag: string, envVariables: { key: string, value: string }[]) {
        const imageFullName = `amrmahmoud377/${imageName}:${tag}`;
        const envArgs = envVariables.map(env => `--build-arg ${env.key}=${env.value}`).join(' ');

        try {
            console.log(`Building image: ${imageName}`);
            await this.executeCommand(`docker build ${envArgs} -t ${imageFullName} ${repoPath}`);
            console.log(`Docker image ${imageFullName} built successfully!`);

            await this.delay(30000);

            const { stdout: images } = await this.execAsync(`docker images -q ${imageFullName}`);
            if (!images.trim()) {
                throw new Error(`Docker image ${imageFullName} does not exist locally.`);
            }
            console.log(`Docker image ${imageFullName} exists locally.`);

            await this.executeCommand('docker login -u amrmahmoud377 -p 3mr_m7moud');
            console.log('Logged in to Docker Hub successfully!');

            // await this.executeCommand(`docker push ${imageFullName}`);
            // console.log(`Docker image ${imageFullName} pushed to Docker Hub successfully!`);
        } catch (error) {
            console.error('Error building or pushing Docker image:', error);
        }
    }

}

