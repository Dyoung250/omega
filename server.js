const http = require('http');
const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Utente/Desktop/site-preview';
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const fp = path.join(root, url === '/' ? 'index.html' : url);
  const ext = path.extname(fp).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Server running on http://127.0.0.1:8080');
});
