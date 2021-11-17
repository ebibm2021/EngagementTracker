FROM node:14

WORKDIR /usr/src/app

ENV NODE_ENV production

# Just copy the package.json...
COPY package*.json ./

# so we can cache this layer:
RUN npm cache clean --force
RUN npm install
RUN npm install -g @angular/cli@latest

COPY . .

RUN ng build

EXPOSE 8080

# command to run on container start
CMD [ "node", "app.js" ]