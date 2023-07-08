# File to hash challenge
The main purpose of this repository is to be able to receive a file using a `POST` endpoint with the `multipart/form-data` content-type, generate a hash from the file, and then collect the size of the file. The hash and the size should be stored on the database and the user should receive this information as a response. The file could have a 1 or 100GB size and should not be saved on disk.

This service uses some advanced concepts from Node Js (such as streams and pipelines) to process the file by demand.

You will find two environments to use:
- Dev: Contains the unit and integration tests. It is recommended to use with small files because the consumption of CPU could be high due to packages such as `nodemon` and `ts-node`.

- Prod: Ready for production. It doesn’t contain tests and is highly recommended to test with a file of any size.

## Usage
Before it starts, be sure that you have already installed [Node](https://nodejs.org/en/download), [Docker](https://docs.docker.com/engine/install/), and [Docker-compose](https://docs.docker.com/compose/install/)

### Dev environment
Clone the repository into your machine and define your env variables, using the file `.env.dev.example` as an example. The env file should be named `.env.dev`

Run the command:

```bash
docker-compose up --build 
```

You also can run in detached mode with the command:

```bash
docker-compose up --build -d
```

Wait until MySQL starts and prompt a message like this: 
```bash
[Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.33'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

Run the command to access the container and starts Prisma inside of the container:
```bash
docker exec -it file-to-hash /bin/bash
yarn prepare-prisma
```

A prompt from Prisma will be shown to you:
```bash
? Enter a name for the new migration: › 
```
You can name it however you want.

After running the command, the prompt will show: 
```bash
Done ...
```

You can close this prompt. Now you can start to use the service sending requests to `http://localhost:3000/` and also run the tests 

#### Unit and integration test
The unit test could be executed in two ways, locally or inside the container.

To run locally, run these commands: 
```bash
yarn install --frozen-lockfile --include=dev
yarn unit-tests
```

If you want to test inside the container, you can access the container and run the same command:
```bash
docker exec -it file-to-hash /bin/bash
yarn unit-tests
```

The integration tests only can be executed inside the container. Make sure that you executed the command `yarn prepare-prisma` before running the integration test. You can run the integration test with the commands:
```bash
docker exec -it file-to-hash /bin/bash
yarn test
```

### Prod environment
Define your env variables, using the file `.env.example` as an example. The env file should be named `.env`

Run the command: 
```bash
docker-compose -f docker-compose-prod.yaml up --build 
```

Wait until MySQL starts and prompt a message like this: 
```bash
[Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.33'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

Run the command to access the container and starts Prisma inside of the container:
```bash
docker exec -it file-to-hash-prod /bin/bash
yarn prepare-prisma
```

Now you can start to use the service using the endpoint `http://localhost:3000/`.
