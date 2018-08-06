FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


ONBUILD COPY . /usr/src/app/

RUN cd /usr/src/app
ONBUILD RUN npm install

EXPOSE 80

# start command
CMD [ "npm", "start" ]
