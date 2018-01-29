# URL shortner

This URL shortner is a this sample application. It uses :

- nginx as webserver
- REACT for the frontend
- express for the API on a nodejs
- MongoDB for the database

![keepcalm wip](./keepcalmwip.png "Keep Calm Work in Progress")


## prerequisites

- node
- docker

## Build and run the application

the `makefile` is not a real makefile, with targets and rules dependencies; but a handy script to get started

- prepare environment:
  ```
  $ make install
  ```
- build react app
  ```
  $ make build
  ```
- run with docker-compose
  ```
  $ make start
  ```
- open your browser on [http://localhost/](http://localhost/)

- stop the dev containers
  ```
  $ make stop
  ```
