
## Description

The projects implements a user manager using nestjs

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run Dockerfile
```bash
$ docker build -t user-management-service .
$ docker run -p 3000:3000 --name user-api user-management-service
```


## Implementation Walkthrough
- Started with analyzing the requirements
- Created initial project with nestjs and dockerfile
- Followed Single Responsibility Principles
- Followed the nestjs architecture principles by using modules, services, and controllers
- Followed Agile Development with tasks and PR on github. Used Github Projects for task tracking https://github.com/users/rishabhmalik759/projects/3/views/1
- Added Unit tests and e2e tests
- Followed standard naming conventions and project structure
- Project can be easily deployed to a auto managed app server from any cloud provider using the github repository hook and dockerfile

## Time consumed
Total time consumed was approx. 4 hours of development


  