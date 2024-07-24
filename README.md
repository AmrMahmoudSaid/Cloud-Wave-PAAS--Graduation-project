<p align="center">
  <img src="/image/logo/logo-removebg-preview (1).png" height="180" width="300"></a>
</p>


#### CLOUD WAVE is a gradation project which aims to build a [Platform as a Service](https://cloud.google.com/learn/what-is-paas)  that simplifies the development, deployment, and management of various types of applications. Cloud Wave allows developers to focus on innovation while we handle the infrastructure and operational complexities.
#### Objectives Achieved:

🔧 Spring, Express, React, or General Application Management:

Seamlessly create and deploy applications by linking GitHub repositories or manually entering URLs.
Choose from various application plans (Basic, Pro, Super).
Easily add environment variables and expose ports as needed.
💾 Database Management:

Effortlessly create and configure MySQL, PostgreSQL, and MongoDB databases.
Select plans based on RAM, CPU, and memory requirements.
Define usernames, passwords, and root passwords with ease.


<!-- Code Tree (files structure) -->

<details>
   <summary><h2> Code Tree (files structure) </h2></summary>


```bash


150 directories, 399 files


```

</details>

<!-- Code Tree (files structure) -->

## How did we build it ?
#### We are using event driven microservices' architecture. 
## our technology stack:
- [Typescript](https://www.typescriptlang.org/) as the main languages for all backend services
- [Express](https://expressjs.com/) framework to handle http requests in the backend
- [MongoDB](https://www.mongodb.com/) for database and [mongoose](https://mongoosejs.com/docs/guide.html) for ODM
- [Nats streaming server](https://github.com/nats-io/nats-streaming-server) as event bus and message queue -a little outdated but for our learning purposes it get the job done just like kafka for example-
- [Ingress-nginx](https://kubernetes.github.io/ingress-nginx/) for load balancing 
- [Docker](https://www.docker.com/) for containerization
- [kubernetes](https://kubernetes.io/) for orchestration
- [Jest](https://jestjs.io/) for testing 
### You can view all the services endpoints  docs from [postman workspace](https://universal-escape-982451.postman.co/workspace/cloud-wave~4884c53e-9afc-4657-9cd3-2e36a113065d/collection/23605089-744685a1-211f-4ece-9cdc-5fc3ccad3430?action=share&creator=23605089)
