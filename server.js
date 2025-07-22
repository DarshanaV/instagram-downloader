const express = require('express');
const cors = require('cors');
const path = require('path');
// const { instagramGetUrl } = require('instagram-url-direct'); // Commented out for now

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
    console.log("Requested URL:", url);
    // const data = await instagramGetUrl(url);
    // console.log("Instagram data:", JSON.stringify(data, null, 2));

    // Temporary mocked response for testing
    const dummyLinks = [
      `https://example.com/fake-${type}-file1.mp4`,
      `https://example.com/fake-${type}-file2.mp4`
    ];

    res.json({ links: dummyLinks });

  } catch (err) {
    console.error("Extraction error:", err);
    res.status(500).json({ error: 'Failed to retrieve media links' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
