# Node Version
FROM node:12

# Working Directory
WORKDIR /usr/src/app

# Ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source code
COPY . .

# Expose port
EXPOSE 3001

CMD ["node", "index.js"]