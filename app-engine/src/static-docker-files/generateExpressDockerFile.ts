import path from "path";
import fs from 'fs'

export const generateExpressDockerfile = async (repoPath: string, PORT: number) => {

    const dockerfileContent = `
ARG NODE_VERSION=16
ARG APP_NAME=myapp
ARG PORT=3000

FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


FROM node:alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE ${PORT}

CMD ["npm", "start"]
  `;

    const dockerfilePath = path.join(repoPath, 'Dockerfile');
    await fs.promises.writeFile(`${repoPath}/Dockerfile`, dockerfileContent, 'utf8');
    console.log(`Dockerfile generated at ${dockerfilePath}`);
};