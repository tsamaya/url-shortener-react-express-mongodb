FROM node:8-alpine

# set working directory
RUN mkdir -p /srv/api
WORKDIR /srv/api

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH /srv/api/node_modules/.bin:$PATH

# Bundle app source
COPY package.json /srv/api

# Install app dependencies
RUN npm install

# start app
CMD ["npm", "run", "start:dev"]
