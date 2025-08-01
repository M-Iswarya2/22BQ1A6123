const express = require('express');
const app = express();
const port = 3000; // Change if needed

// In-memory store for URLs
const urlStore = {};

app.use(express.json());

// GET / - Friendly message for root
app.get('/', (req, res) => {
    res.send('URL Shortener Service is running. Use POST /shorturls to create a short URL.');
});

// POST /shorturls - Create a short URL
app.post('/shorturls', (req, res) => {
    const { url, validity, shortcode } = req.body;
    if (!url || !validity || !shortcode) {
        return res.status(400).json({ error: 'url, validity, and shortcode are required' });
    }
    const expiry = Date.now() + validity * 1000;
    urlStore[shortcode] = { url, expires: expiry };
    res.json({
        sortlink: `http://localhost:${port}/${shortcode}`,
        expiry: expiry
    });
});

// GET /:shortcode - Redirect if valid
app.get('/:shortcode', (req, res) => {
    const entry = urlStore[req.params.shortcode];
    if (entry) {
        if (Date.now() < entry.expires) {
            return res.redirect(entry.url);
        } else {
            return res.status(410).json({ error: 'URL expired' });
        }
    }
    res.status(404).json({ error: 'Shortcode not found' });
});

app.listen(port, () => {
    console.log(`URL Shortener running at http://localhost:${port}`);
});