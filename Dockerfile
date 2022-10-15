FROM node:16
WORKDIR /app

COPY package.json .
COPY .npmrc .

RUN npm install
COPY . ./

EXPOSE 1337

CMD ["npm", "run", "dev"]
