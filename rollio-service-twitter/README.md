# Rollio-Service-Twitter
Requests list of vendors from the vendor service to get an array of twitter IDs to listen on.
When a new tweet comes in the service parses it and determines whether or not an eligble location has been found. 
The resulting data gets pushed back to the Vendor Service via RabbitMQ where the Vendor Service is constantly listening for new messages.

# Docker Setup
Containerizing
docker images
docker ps

docker build -t *imagename*:*tag* .
docker run -rm -p 3001:3001 --env-file ./.env *imagename*:*tag*
docker-machine ip default (get docker ip)
docker exec -it *containerid* bash

# Running With Logs
docker run -it --log-driver="awslogs" --log-opt awslogs-region="us-east-1" --log-opt awslogs-group="rollio-service-vendor-dev" --log-opt awslogs-stream="log-stream" -p 3001:3001 --env-file ./.env --name rollio-service-vendor-tst rollio-service-vendor:dev

stopping
docker ps
docker stop *container_id*
docker rm *container_id*

# Get IP
docker-machine ip

# Login to AWS
aws ecr get-login --no-include-email --region us-east-1

