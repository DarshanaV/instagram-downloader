const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/download', async (req, res) => {
  const { url, type } = req.body;
  if (!url || !type) return res.status(400).json({ error: 'Missing URL or type' });

  try {
    console.log('Calling Instagram Scrapper API:', url);

    const response = await axios.get(
      'https://instagram-scrapper-api-posts-reels-stories-downloader.p.rapidapi.com/instagram/',
      {
        params: { url },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'instagram-scrapper-api-posts-reels-stories-downloader.p.rapidapi.com'
        }
      }
    );

    const items = Array.isArray(response.data.links) ? response.data.links : [];

	const links = items
	  .filter(item => {
		if (type === 'video') return item.type === 'mp4';
		if (type === 'photo') return item.type === 'jpg';
		return true;
	  })
	  .map(item => item.url);


    console.log('Media links:', links);
	console.log('📦 Full API response:', JSON.stringify(response.data, null, 2));

    return res.json({ links });

  } catch (err) {
    console.error('🔥 API error:', err.response?.status, err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to retrieve media links' });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
