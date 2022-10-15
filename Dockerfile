FROM node
WORKDIR /app

COPY package.json .



RUN npm install

COPY . .

RUN ls -a

EXPOSE 1337

CMD ["npm", "run", "dev"]
