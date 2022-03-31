# Docker based execution

This module/pod is dependent on the backend-core and backend-analytics pods for execution.
Ensure these dependent pods are up for complete functionality.

- Ensure docker is installed on the system.
- Ensure you have logged in to docker by command `docker login`
- Execute `docker build -t engagement-tracker-frontend-ui:v1 .` to build a local image.
- Execute `docker tag engagement-tracker-frontend-ui:v1 <docker username>/engagement-tracker-frontend-ui:v1` to tag the local image to a dockerhub repository corresponding to the docker username.
- Execute `docker push <docker username>/engagement-tracker-frontend-ui:v1` to push the image to remote repository.
- Execute `docker run -p 80:8091 -d <docker username>/engagement-tracker-frontend-ui:v1` to execute a container based on the image.
- The frontend UI should be running at port `80`

# Local execution for debugging

- Execute `ng serve` and the application would be running at `localhost:4200`.