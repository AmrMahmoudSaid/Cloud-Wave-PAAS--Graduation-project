import path from "path";
import xml2js from'xml2js';
import fs from 'fs'

export const generateSpringDockerfile = async (repoPath: string) => {
    console.log(`Generating Spring Docker file for ${repoPath}`);
    const xmlData = fs.readFileSync(`${repoPath}/pom.xml`, 'utf8');
    const parser = new xml2js.Parser();

    const result = await parser.parseStringPromise(xmlData);
    const { groupId, artifactId, version } = result.project;
    const artifactName = artifactId[0];
    const artifactVersion = version[0];
    console.log(artifactName);
    const jdkVersion = result.project.properties[0]['java.version'][0];
    console.log(jdkVersion);

    const dockerfileContent = `
# Use build arguments for flexibility
ARG JDK_VERSION=${jdkVersion}
ARG ARTIFACT_NAME=${artifactName}
ARG ARTIFACT_VERSION=${artifactVersion}
ARG PATH=${repoPath}
# Use a base image with Maven and OpenJDK 11 (adjust the version as needed)
# Use the official Maven image to create a build artifact.
FROM maven:3.8.1-openjdk-17 AS build

# Set the working directory in the container.
WORKDIR /app

# Copy the pom.xml file and the source code to the container.
COPY pom.xml .
COPY src ./src

# Build the project.
RUN mvn clean package -DskipTests

# Use the official OpenJDK image to create a container that can run the application.
FROM openjdk:17-jdk-slim

# Set the working directory in the container.
WORKDIR /app

# Copy the build artifact from the build stage.
COPY --from=build /app/target/*.jar app.jar

# Specify the command to run the application.
ENTRYPOINT ["java", "-jar", "app.jar"]


  `;

    const dockerfilePath = path.join(repoPath, 'Dockerfile');
    await fs.promises.writeFile(`${repoPath}/Dockerfile`, dockerfileContent, 'utf8');
    console.log(`Dockerfile generated at ${dockerfilePath}`);
};