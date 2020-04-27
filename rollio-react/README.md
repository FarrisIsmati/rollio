Front end developed in React & Redux with Typescript and SASS.

# Docker Setup
docker build --rm -f Dockerfile -t rollio-service-react:latest .
docker run -it --rm -p 80:80 --env-file ./.env rollio-service-react:latest
