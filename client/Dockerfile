FROM node:14-alpine
COPY package.json .
COPY package-lock.json .
# Copy the local code to the container
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000 to the outside world
EXPOSE 3000