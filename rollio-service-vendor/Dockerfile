# Base image
FROM node:13

# Working Directory
WORKDIR /usr/src/app

# Ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install Vim
RUN apt-get update \
    && apt-get install -y \
        nmap \
        vim

# Install node modules
RUN npm install

# Bundle app source code
COPY . .

# Expose port
EXPOSE 3001

CMD ["npm", "start"]
