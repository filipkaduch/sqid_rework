FROM node:lts-alpine


COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --host

EXPOSE 443

CMD [ "npm", "run", "serve --host" ]
