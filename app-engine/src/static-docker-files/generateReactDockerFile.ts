import path from "path";
import fs from 'fs'

export const generateReactDockerfile = async (repoPath: string, PORT: number) => {


    const dockerfileContent = `
ARG NODE_VERSION=16
ARG PORT=3000

FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
  `;

    const dockerfilePath = path.join(repoPath, 'Dockerfile');
    await fs.promises.writeFile(`${repoPath}/Dockerfile`, dockerfileContent, 'utf8');
    console.log(`Dockerfile generated at ${dockerfilePath}`);
};