# Use the Docker-in-Docker (DinD) image (consider using a specific version for stability)
FROM docker:dind

# Install Node.js and npm (use a multi-stage build for production)
RUN apk update && apk upgrade && apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (consider using `--production` for production builds)
RUN npm install --omit=dev && npm install --save-dev @types/dockerode

# Copy the rest of the application code
COPY . .

# Command to start your application
CMD ["npm", "start"]
