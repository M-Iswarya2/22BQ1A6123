const express = require('express');
const app = express();
const port = 3000; // Change if needed

// In-memory store for URLs
const urlStore = {};

app.use(express.json());

// POST /shorturls - Create a short URL
app.post('/shorturls', (req, res) => {
    const { url, validity, shortcode } = req.body;
    if (!url || !validity || !shortcode) {
        return res.status(400).json({ error: 'url, validity, and shortcode are required' });
    }
    urlStore[shortcode] = { url, expires: Date.now() + validity * 1000 };
    res.json({ shortUrl: `http://localhost:${port}/${shortcode}` });
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