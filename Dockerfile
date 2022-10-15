FROM node
WORKDIR /app

COPY package.json package-lock.json ./
COPY .npmrc .


RUN npm ci

COPY . .

EXPOSE 1337

CMD ["npm", "run", "dev"]
