# Base image
FROM node:13-alpine

# Working Directory
WORKDIR /usr/src/app

# Ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source code
COPY . .

# Expose port
EXPOSE 3002

CMD ["npm", "start"]