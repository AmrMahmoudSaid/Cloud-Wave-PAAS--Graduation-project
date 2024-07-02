FROM docker:dind

RUN apk update && apk upgrade && apk add --no-cache nodejs npm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev && npm install --save-dev @types/dockerode

COPY . .

CMD ["npm", "start"]
