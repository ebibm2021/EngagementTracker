# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm cache clean --force
RUN npm install
COPY ./ /app/
RUN node_modules/.bin/ng prestart
RUN node_modules/.bin/ng build -- --prod --output-path=./dist

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
#Copy ci-dashboard-dist
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
#Copy default nginx configuration
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx

ENTRYPOINT ["nginx", "-g", "daemon off;"]