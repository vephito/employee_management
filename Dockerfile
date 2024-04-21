FROM node:21.7.3-alpine3.18
WORKDIR usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3030
CMD ["npm", "start"]