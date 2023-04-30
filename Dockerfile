FROM node:lts-alpine


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 443

RUN npm run dev

EXPOSE 443

CMD [ "npm", "run", "serve --host" ]
