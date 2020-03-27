FROM node:8.9.4

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]

# https://stackoverflow.com/questions/41093812/how-to-get-docker-containers-to-talk-to-each-other-while-running-on-my-local-hos