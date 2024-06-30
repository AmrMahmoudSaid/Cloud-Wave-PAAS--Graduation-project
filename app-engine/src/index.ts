import 'express-async-errors'
import mongoose from 'mongoose';
import {natsWrapper} from "./nats-wrapper";
import {AppDeleteListener} from "./events/listeners/app-delete-listener";
import {AppPaymentCompletedListener} from "./events/listeners/app-payment-completed-listener";

const start = async () => {
    if (!process.env.NATS_URL){
        throw  new Error('NATS_URL doesnt exist');
    }
    if (!process.env.NATS_CLUSTER_ID){
        throw  new Error('NATS_CLUSTER_ID doesnt exist');
    }
    if (!process.env.NATS_CLIENT_ID){
        throw  new Error('NATS_CLIENT_ID doesnt exist');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close',()=>{
            console.log('nats connection closed!');
        });
        process.on('SIGTERM', ()=> natsWrapper.client.close());
        process.on('SIGINT', ()=> natsWrapper.client.close());
        // await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        // await mongoose.connect('mongodb://localhost:27017/auth2' );
        new AppDeleteListener(natsWrapper.client).listen();
        new AppPaymentCompletedListener(natsWrapper.client).listen();

        console.log("DB connection");
    }catch (err){
        console.log(err);
    }
};
start();

// import simpleGit from 'simple-git';
// import path from 'path';
// import fs from 'fs';
// import { exec } from 'child_process';
// import { promisify } from 'util';
//
// const execAsync = promisify(exec);
//
// async function delay(ms: number) {
//         return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// async function executeCommand(command: string) {
//         try {
//                 const { stdout, stderr } = await execAsync(command);
//                 console.log('stdout:', stdout);
//                 console.error('stderr:', stderr);
//         } catch (error) {
//                 console.error('Error executing command:', error);
//         }
// }
//
// async function buildDockerImage(repoUrl: string, imageName: string, tag: string) {
//         // const git = simpleGit();
//         const repoPath = path.join(__dirname, 'repository');
//         //
//         // // Clone the repository
//         // if (fs.existsSync(repoPath)) {
//         //         fs.rmdirSync(repoPath, { recursive: true });
//         // }
//         // await git.clone(repoUrl, repoPath);
//
//         // Define the image name and tag
//         const imageFullName = `${imageName}:${tag}`;
//
//         try {
//                 // Build the Docker image
//                 await executeCommand(`docker build -t ${imageFullName} ${repoPath}`);
//                 console.log(`Docker image ${imageFullName} built successfully!`);
//
//                 // Delay to allow Docker to recognize the new image
//                 await delay(5000);
//
//                 // Verify the image exists locally
//                 const { stdout: images } = await execAsync(`docker images -q ${imageFullName}`);
//                 if (!images.trim()) {
//                         throw new Error(`Docker image ${imageFullName} does not exist locally.`);
//                 }
//                 console.log(`Docker image ${imageFullName} exists locally.`);
//
//                 // Login to Docker Hub
//                 await executeCommand('docker login -u amrmahmoud377 -p 3mr_m7moud');
//                 console.log('Logged in to Docker Hub successfully!');
//
//                 // Push the Docker image to Docker Hub
//                 await executeCommand(`docker push ${imageFullName}`);
//                 console.log(`Docker image ${imageFullName} pushed to Docker Hub successfully!`);
//         } catch (error) {
//                 console.error('Error building or pushing Docker image:', error);
//         }
// }
//
// // Example usage
// const repoUrl = 'https://github.com/AmrMahmoudSaid/Nabd_project.git';
// const imageName = 'amrmahmoud377/nabdapp';
// const tag = 'latest';
//
// buildDockerImage(repoUrl, imageName, tag);
