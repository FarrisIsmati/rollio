# Base image
FROM nginx:1.15.2-alpine

# Copy build
COPY ./build /var/www

# Copy nginx server config
COPY nginx.conf /etc/nginx/nginx.conf

# Run port 80
EXPOSE 80

# Start process
ENTRYPOINT ["nginx","-g","daemon off;"]

# # Base image
# FROM node:13 as builder

# # Working Directory
# WORKDIR /usr/src/app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # Ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Install node modules
# RUN npm install
# # RUN npm install react-scripts@3.4.0 -g

# # Bundle app source code
# COPY . .

# # Build the app
# RUN npm run build

# # # Expose port
# EXPOSE 3000

# CMD ["npm","start","--loglevel","debug"]

# # # Production environment
# # FROM nginx:1.13.9-alpine

# # COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# # # Expose port
# # EXPOSE 3000

# # CMD ["nginx", "-g", "daemon off;"] 