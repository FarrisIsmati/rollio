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
