const express = require('express');
const cors = require('cors');
const path = require('path');
const { instagramGetUrl } = require('instagram-url-direct');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/download', async (req, res) => {
  const { url, type } = req.body;
  if (!url || !type) {
    return res.status(400).json({ error: 'Missing URL or type' });
  }

  try {
    const data = await instagramGetUrl(url);
    if (!data || !data.url_list || data.url_list.length === 0) {
      return res.json({ links: [] });
    }

    const links = data.media_details
      .filter(m => {
        if (type === 'video') return m.type === 'video';
        if (type === 'photo') return m.type === 'image';
        return true;
      })
      .map(m => m.url);

    res.json({ links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve media links' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
