# Use official Node.js image as the build environment
FROM node:20-alpine AS builder
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev", "--", "--host"]