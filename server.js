const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

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
    console.log('Fetching via RapidAPI:', url);
	console.log('RAPIDAPI_KEY present:', !!process.env.RAPIDAPI_KEY);

    const response = await axios.get(
      'https://instagram-scrapper-api-posts-reels-stories-downloader.p.rapidapi.com/instagram/',
      {
        params: { url },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // set in Render dashboard
          'X-RapidAPI-Host': 'instagram-scrapper-api-posts-reels-stories-downloader.p.rapidapi.com'
        }
      }
    );

    const items = response.data || [];
    console.log('Received items:', items.length);

    // Filter based on type
    const links = items
      .filter(item => {
        if (type === 'video') return item.type === 'video';
        if (type === 'photo') return item.type === 'image';
        return true;
      })
      .map(item => item.link);

    res.json({ links });

  } catch (err) {
    const status = err.response?.status;
	const body = err.response?.data;
	console.error('🔴 RapidAPI request failed: status=', status, 'body=', body);
	res.status(500).json({ error: 'Failed to retrieve media links' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});