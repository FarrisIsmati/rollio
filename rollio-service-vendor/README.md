# Rollio-Service-Vendor
Vendor service has an open connection to the Twitter service via RabbitMQ. 
When new tweets are recieved the Vendor service then updates data each vendor accordingly pending the data payload.
This service also currently has a small API that allows users to get regions, get vendors, post comments, and the accuracy of a location. 
Most all get routes are chaced in the RedisDB except for any routes with a QS.
All routes have a general rate limit to prevent throttling. 
Comments are currently rate limited to one post per vendor per day.

# Docker Setup
Containerizing
docker images
docker ps

docker build -t *imagename*:*tag* .
docker run -d -p *port*:*port* --env-file *./.env* --name *containername* *image:tag*
docker-machine ip default (get docker ip)
docker exec -it *containerid* bash

# Running With Logs
docker run -it --log-driver="awslogs" --log-opt awslogs-region="us-east-1" --log-opt awslogs-group="rollio-service-vendor-dev" --log-opt awslogs-stream="log-stream" -p 3001:3001 --env-file ./.env --name rollio-service-vendor-tst rollio-service-vendor:dev

stopping
docker ps
docker stop *container_id*
docker rm *container_id*