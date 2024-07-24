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

CLOUD-WAVE-PAAS--GRADUATION-PROJECT
├───app-engine
│   │   .dockerignore
│   │   Dockerfile
│   │   in.js
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───application-deployment-config
│       │       app-depl-config.ts
│       │       docker-fun.ts
│       │       git-fun.ts
│       │       jenkins.ts
│       │
│       ├───events
│       │   ├───listeners
│       │   │       app-delete-listener.ts
│       │   │       app-payment-completed-listener.ts
│       │   │       queue-group-name.ts
│       │   │
│       │   └───publisher
│       │           app-engine-create-publisher.ts
│       │
│       ├───models
│       │       order-engine.ts
│       │
│       ├───routes
│       │       webhook.ts
│       │
│       └───static-docker-files
│               generateExpressDockerFile.ts
│               generateReactDockerFile.ts
│               generateSpringDockerFile.ts
│
├───app-management
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───events
│       │   ├───listeners
│       │   │       app-payment-completed-listener.ts
│       │   │       application-engine-completed-listener.ts
│       │   │       queue-group-name.ts
│       │   │
│       │   └───publishers
│       │           app-delete-publisher.ts
│       │
│       ├───models
│       │       app-config.ts
│       │
│       └───routes
│               billing.ts
│               delete.ts
│               exec.ts
│               health.ts
│               index.ts
│               logs.ts
│               show.ts
│
├───app-order
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───events
│       │   ├───listeners
│       │   │       app-payment-completed-listener.ts
│       │   │       queue-group-name.ts
│       │   │
│       │   └───publisher
│       │           application-order-create-publisher.ts
│       │
│       ├───models
│       │       order.ts
│       │
│       └───routes
│               get-repo.ts
│               new.ts
│
├───auth
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───event
│       │   └───publisher
│       │           user-created-publisher.ts
│       │
│       ├───models
│       │       user.ts
│       │
│       ├───routes
│       │   │   create-customer.ts
│       │   │   currentuser.ts
│       │   │   signin-github.ts
│       │   │   signin.ts
│       │   │   signout.ts
│       │   │   signup-github.ts
│       │   │   signup.ts
│       │   │   update.ts
│       │   │
│       │   └───__test__
│       │           currentuser.test.ts
│       │           siginin.test.ts
│       │           signout.test.ts
│       │           signup.test.ts
│       │
│       ├───service
│       │       password.ts
│       │
│       └───test
│               setup.ts
│
├───client
│   │   .eslintrc.cjs
│   │   .gitignore
│   │   Dockerfile
│   │   index.html
│   │   package-lock.json
│   │   package.json
│   │   postcss.config.js
│   │   README.md
│   │   tailwind.config.js
│   │   vite.config.js
│   │
│   ├───public
│   │       vite.svg
│   │
│   └───src
│       │   App.jsx
│       │   index.css
│       │   Login.module.css
│       │   main.jsx
│       │
│       ├───assets
│       │   │   Basic.svg
│       │   │   Contactus.jpg
│       │   │   icon.png
│       │   │   login.png
│       │   │   logo.png
│       │   │   mongo.png
│       │   │   mysql.png
│       │   │   postgres.png
│       │   │   Pro.svg
│       │   │   react.svg
│       │   │   rocket.png
│       │   │   Super.svg
│       │   │
│       │   └───space
│       │           8526120.ai
│       │           8526121.eps
│       │           spaceman.jpg
│       │
│       ├───components
│       │       BasicCont.jsx
│       │       CreatingProg.jsx
│       │       Footer.jsx
│       │       LoginForm.jsx
│       │       NoApps.jsx
│       │       NoDatabase.jsx
│       │       PaymentForm.jsx
│       │       PendingProg.jsx
│       │       ProCont.jsx
│       │       Profile.jsx
│       │       RunningProg.jsx
│       │       SignOut.jsx
│       │       SignupForm.jsx
│       │       starrating.jsx
│       │       SuperCont.jsx
│       │
│       └───pages
│               aboutus.jsx
│               AddApplication.jsx
│               AddDatabase.jsx
│               AppLogs.jsx
│               Billing.jsx
│               callback.jsx
│               Cont.jsx
│               contactUs.jsx
│               DatabaseLogs.jsx
│               feedback.jsx
│               help.jsx
│               HomePage.jsx
│               Login.jsx
│               Payment.jsx
│               Profile.jsx
│               Signup.jsx
│               UserProfile.jsx
│
├───common
│   │   .gitignore
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   index.ts
│       │   ingressConfig.ts
│       │   kubctl-connection.ts
│       │   kubectl-fun.ts
│       │
│       ├───errors
│       │       BadRequestError.ts
│       │       custom-error.ts
│       │       database-connection-error.ts
│       │       not-authorized-error.ts
│       │       not-found.ts
│       │       request-validation-error.ts
│       │
│       ├───event
│       │   │   application-delete-event.ts
│       │   │   application-engine-create-event.ts
│       │   │   application-order-create-event.ts
│       │   │   Application-payment-completed-event.ts
│       │   │   base-listener.ts
│       │   │   base-publesher.ts
│       │   │   database-delete-event.ts
│       │   │   database-engine-create-event.ts
│       │   │   database-order-create-event.ts
│       │   │   order-cancelled-event.ts
│       │   │   payment-completed-event.ts
│       │   │   subjects.ts
│       │   │   user-created-event.ts
│       │   │
│       │   ├───enums
│       │   │       application-order-types.ts
│       │   │       application-plan-config.ts
│       │   │       application-plan.ts
│       │   │       database-order-types.ts
│       │   │       database-plan-config.ts
│       │   │       database-plans.ts
│       │   │       host.ts
│       │   │       order-status.ts
│       │   │
│       │   └───interfaces
│       │           app-depl.ts
│       │           database-depl.ts
│       │           ingress-rule.ts
│       │           mongo-depl.ts
│       │           mysql-depl.ts
│       │           postges-depl.ts
│       │
│       └───middlewares
│               current-user.ts
│               error-handler.ts
│               require-auth.ts
│               validate-request.ts
│
├───database-engine
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   ├───src
│   │   │   index.ts
│   │   │   nats-wrapper.ts
│   │   │
│   │   ├───databases-deployment-config
│   │   │       mongo.ts
│   │   │       mysql.ts
│   │   │       postgres.ts
│   │   │
│   │   ├───events
│   │   │   ├───listeners
│   │   │   │   │   database-delete-listener.ts
│   │   │   │   │   payment-completed-listener.ts
│   │   │   │   │   queue-group-name.ts
│   │   │   │   │
│   │   │   │   └───__test__
│   │   │   │           payment-completed-listener.test.ts
│   │   │   │
│   │   │   └───publisher
│   │   │           database-engine-create-publisher.ts
│   │   │
│   │   └───test
│   │           setup.ts
│   │
│   └───__mocks__
│           nats-wrapper.ts
│
├───database-management
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───events
│       │   ├───listeners
│       │   │       database-engine-completed-listener.ts
│       │   │       queue-group-name.ts
│       │   │
│       │   └───publishers
│       │           database-delete-publisher.ts
│       │
│       ├───models
│       │       database-config.ts
│       │
│       ├───routes
│       │       billing.ts
│       │       delete.ts
│       │       index.ts
│       │       logs.ts
│       │       show.ts
│       │
│       └───test
│               setup.ts
│
├───databsae-order
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   app.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───events
│       │   ├───listeners
│       │   │       payment-completed-listener.ts
│       │   │       queue-group-name.ts
│       │   │
│       │   └───publisher
│       │           database-order-create-publisher.ts
│       │
│       ├───models
│       │       order.ts
│       │
│       ├───routes
│       │       new.ts
│       │
│       └───test
│               setup.ts
│
├───email
│   │   .dockerignore
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   tsconfig.json
│   │
│   └───src
│       │   custom.d.ts
│       │   emails.ts
│       │   index.ts
│       │   nats-wrapper.ts
│       │
│       ├───email
│       │       baseEmail.pug
│       │       passwordReset.pug
│       │       paymentEmail.pug
│       │       welcome.pug
│       │       _style.pug
│       │
│       └───event
│           └───listeners
│                   app-payment-completed-listener.ts
│                   payment-completed-listener.ts
│                   queu-group-name.ts
│                   user-created-listener.ts
│
├───image
│   └───logo
│           logo-removebg-preview (1).png
│
├───infra
│   └───K8s
│           app-engine-db.yaml
│           app-engine-depl.yaml
│           app-management-depl.yaml
│           app-management-mongo.yaml
│           app-order-db.yaml
│           app-order-depl.yaml
│           auth-depl.yaml
│           auth-mongo-depl.yaml
│           client-depl.yaml
│           database-engine.yaml
│           database-management-depl.yaml
│           database-management-mongo.yaml
│           database-order.yaml
│           Dockerfile
│           email-depl.yaml
│           engine-db.yaml
│           ingress-app-srv.yaml
│           ingress-srv.yaml
│           ingress-system.yaml
│           ipaddresspool.yaml
│           jenkins.yaml
│           nats-depl.yaml
│           ngrok-ingress.yaml
│           order-db.yaml
│           payment-depl.yaml
│           payment-mongo-depl.yaml
│
└───payment
    │   .dockerignore
    │   Dockerfile
    │   package-lock.json
    │   package.json
    │   tsconfig.json
    │
    └───src
        │   app.ts
        │   index.ts
        │   nats-wrapper.ts
        │
        ├───events
        │   ├───listeners
        │   │       app-delete-listener.ts
        │   │       application-order-create-listener.ts
        │   │       database-delete-listener.ts
        │   │       database-order-completed.ts
        │   │       queue-group-name.ts
        │   │       user-created-listener.ts
        │   │
        │   └───publisher
        │           application-payment-completed-publisher.ts
        │           payment-completed-publisher.ts
        │
        └───models
                order.ts
                product.ts
                user.ts

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
