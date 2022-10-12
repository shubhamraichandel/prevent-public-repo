FROM node:16
WORKDIR /app

COPY package.json .


RUN npm install
COPY . ./

EXPOSE 1337

RUN npm run dev
CMD ["npm", "start"]
