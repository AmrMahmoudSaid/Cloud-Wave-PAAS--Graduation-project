import axios from 'axios';
import path from "path";

const JENKINS_URL = process.env.JENKINS_URL ;
const JENKINS_USER = process.env.JENKINS_USER ;
const JENKINS_API_TOKEN = process.env.JENKINS_API_TOKEN ;
let gitUrl ='';
let gitPath='';
const API_UPDATE_ENDPOINT = 'http://app-engine-srv:4000/api/webhook/';
export const createJenkinsJob = async (jobName: string, path: string, urlGit: string) => {
    gitUrl= urlGit;
    gitPath= path;
    console.log(JENKINS_API_TOKEN);
    console.log(JENKINS_USER)
    console.log(JENKINS_URL)
    const pipelineScript = `
pipeline {
    agent any

    environment {
        REPO_URL = '${gitUrl}'
        LOCAL_PATH = '${gitPath}'
        JENKINS_API_TOKEN = "${JENKINS_API_TOKEN}"
        JENKINS_USER = "${JENKINS_USER}"
        JOB_NAME = "${jobName}"
        API_UPDATE_ENDPOINT = 'http://app-engine-srv:4000/api/webhook/'
    }

    stages {
        stage('Clone or Pull Repository') {
            steps {
                script {
                    // Ensure the directory exists
                    checkout scm
                    
                    // Call API endpoint after git pull
                    def response = sh(script: "curl -X GET -u ${JENKINS_USER}:${JENKINS_API_TOKEN} ${API_UPDATE_ENDPOINT}${jobName}", returnStdout: true)
                    echo "API Response: response"
                }
            }
        }
    }
}

`;

    const configXml = `
<flow-definition plugin="workflow-job@2.39">
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.89">
    <script>${pipelineScript}</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>`;

    const url = `${JENKINS_URL}createItem?name=${jobName}`;

    try {
        const response = await axios.post(url, configXml, {
            auth: {
                // @ts-ignore
                username: JENKINS_USER,
                // @ts-ignore
                password: JENKINS_API_TOKEN
            },
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/json, text/plain, */*'

            }
        });
        console.log(response);
        if (response.status === 200) {
            console.log(`Job '${jobName}' created successfully.`);
        } else {
            console.error(`Failed to create job '${jobName}'. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating Jenkins job:', error);
    }
};