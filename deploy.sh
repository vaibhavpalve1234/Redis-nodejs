#!/bin/bash
docker build -t my-local-app .
docker tag my-local-app my-local-app:latest
ssh deploy@$DEPLOY_SERVER << EOF
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi my-local-app:current || true
docker tag my-local-app:latest my-local-app:current

# Run the container and bind to all interfaces (0.0.0.0)
docker run -d --restart always --name api-boilerplate -p 3000:3000 my-local-app:current
EOF