# Base image
FROM node:13-alpine

# Working Directory
WORKDIR /usr/src/app

# Ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Add bash (for SSH) to alpine image
RUN apk add --no-cache bash

RUN npm install

# Bundle app source code
COPY . .

# Expose port
EXPOSE 3001

CMD ["npm", "start"]
