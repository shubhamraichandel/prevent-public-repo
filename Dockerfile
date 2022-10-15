FROM node
WORKDIR /app

COPY package.json .
COPY .npmrc .


RUN npm ci

COPY . .

EXPOSE 1337

CMD ["npm", "run", "dev"]
