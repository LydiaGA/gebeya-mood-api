FROM node:10.16.3

MAINTAINER Elias Andualem <eliasandualem8@gmail.com>

ADD . /home/users/api

WORKDIR /home/users/api

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]

