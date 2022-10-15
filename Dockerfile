FROM node
WORKDIR /app

COPY package.json package-lock.json ./app
COPY .npmrc .


RUN npm ci

COPY . .

RUN ls -a

EXPOSE 1337

CMD ["npm", "run", "dev"]
