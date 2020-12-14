# Dockerfile app
FROM node:10.11

RUN mkdir /home/node/app

WORKDIR /home/node/app

ADD package*.json ./

RUN ls -lha

RUN npm install

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 3001

CMD ["npm", "start"]