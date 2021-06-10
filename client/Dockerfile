FROM node:latest

RUN mkdir /client
WORKDIR /client

RUN npm update && npm install yarn

COPY package.json /client/package.json

RUN yarn install

COPY . /client