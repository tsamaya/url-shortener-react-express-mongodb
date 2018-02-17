FROM node:8-alpine

# set working directory
RUN mkdir -p /srv/app
WORKDIR /srv/app

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH /srv/app/node_modules/.bin:$PATH

# Bundle app source
COPY package.json /srv/app

# Install app dependencies
RUN npm install

EXPOSE 35729

# start app
CMD [ "npm", "start"]
