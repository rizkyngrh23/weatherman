const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

// Middleware for req time
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
    });
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'");
    next();
});

app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.post('/some-endpoint', (req, res) => {
    res.json({ message: 'POST request received' });
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
