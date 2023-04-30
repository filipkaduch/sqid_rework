
const hostname = '147.175.121.153';

const port = process.env.PORT || 80
/* app.listen(port, hostname); */

const http = require('http');


const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello world')
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});
