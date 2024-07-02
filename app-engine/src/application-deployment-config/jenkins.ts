import axios from 'axios';
import path from "path";

const JENKINS_URL = process.env.JENKINS_URL ;
const JENKINS_USER = process.env.JENKINS_USER ;
const JENKINS_API_TOKEN = process.env.JENKINS_API_TOKEN ;
let gitUrl ='';
let gitPath='';
export const createJenkinsJob = async (jobName: string, path: string, urlGit: string) => {
    gitUrl= urlGit;
    gitPath= path;
    const pipelineScript = `
pipeline {
    agent any

    environment {
        REPO_URL = '${gitUrl}'
        LOCAL_PATH = '${gitPath}'
    }

    stages {
        stage('Clone or Pull Repository') {
            steps {
                script {
                    if (fileExists("${gitPath}/.git")) {
                        echo 'Directory already exists, pulling the latest changes...'
                        dir(env.LOCAL_PATH) {
                            sh 'git pull'
                        }
                    }
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

    const url = `${JENKINS_URL}/createItem?name=${jobName}`;

    try {
        const response = await axios.post(url, configXml, {
            auth: {
                // @ts-ignore
                username: JENKINS_USER,
                // @ts-ignore
                password: JENKINS_API_TOKEN
            },
            headers: {
                'Content-Type': 'application/xml'
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