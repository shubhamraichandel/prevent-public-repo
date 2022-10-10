const {createNodeMiddleware} = require("@octokit/app");

const http = require("http");
const app = require("./index");


const port = process.env.PORT || 1337;


const server = http.createServer(createNodeMiddleware(app));

server.listen(port, () => {
    console.log(`live at http://localhost:${port}`);
   
});