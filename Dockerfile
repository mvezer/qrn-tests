FROM node:8.6

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

COPY config.json /app

RUN npm install

COPY ./src /app/src

COPY ./lib/libQRNG.so /usr/lib

EXPOSE 3000

CMD ["npm", "start"]