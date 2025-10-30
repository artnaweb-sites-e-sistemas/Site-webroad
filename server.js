const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/lp.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve lp.html instead
                const fallbackPath = path.join(__dirname, 'lp.html');
                fs.readFile(fallbackPath, (fallbackErr, fallbackData) => {
                    if (fallbackErr) {
                        res.writeHead(404);
                        res.end('File not found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(fallbackData);
                });
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
            return;
        }
        
        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Mobile menu should work at http://localhost:${PORT}`);
    console.log(`🔄 Redirects root (/) to /lp.html automatically`);
});
