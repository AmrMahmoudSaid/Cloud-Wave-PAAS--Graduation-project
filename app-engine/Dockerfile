# Use Docker-in-Docker (DinD) base image
FROM docker:20.10.7-dind

# Install Node.js
RUN apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

RUN npm install --omit=dev && npm install --save-dev @types/dockerode

# Copy the rest of the application code
COPY . .

# Command to start your application
CMD ["npm", "start"]
