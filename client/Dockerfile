FROM node:latest

RUN npm update && npm install yarn

RUN mkdir /client
WORKDIR /client

COPY package.json /client/package.json

RUN yarn install

COPY . /client