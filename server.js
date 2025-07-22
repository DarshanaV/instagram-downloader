app.post('/api/download', async (req, res) => {
  const { url, type } = req.body;

  if (!url || !type) {
    return res.status(400).json({ error: 'Missing URL or type' });
  }

  try {
    console.log("Requested URL:", url); // 👈 Add this
    const data = await instagramGetUrl(url);
    console.log("Instagram data:", JSON.stringify(data, null, 2)); // 👈 Add this

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
    console.error("Extraction error:", err); // 👈 Add this
    res.status(500).json({ error: 'Failed to retrieve media links' });
  }
});
