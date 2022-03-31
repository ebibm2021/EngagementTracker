# Docker based execution

This module/pod is dependent on the backend-core and backend-analytics pods for execution.
Ensure these dependent pods are up for complete functionality.

- Ensure docker is installed on the system.
- Ensure you have logged in to docker by command `docker login`
- Execute `docker build -t <docker username>/engagement-tracker-frontend-ui:v1 .` to build a local image.
- Execute `docker run -p 80:8091 -d <docker username>/engagement-tracker-frontend-ui:v1` to execute a container based on the image.
- The frontend UI should be running at port `80`