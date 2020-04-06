Front end developed in React & Redux with Typescript and SASS.

# Docker Setup
docker build -t rollio-service-react:*tag*
docker run -it -v ${cmd}:/app -v /app/node_modules -p *port*:*port* rollio-service-react:dev
NOTE: ${cmd} for windows ${PWD} for mac
