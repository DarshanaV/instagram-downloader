let selectedType = 'video';

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    selectedType = tab.getAttribute('data-type');
  });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  const feedback = document.getElementById('feedback');
  const result = document.getElementById('result');

  if (!url) {
    alert('Please paste an Instagram link.');
    return;
  }

  feedback.classList.remove('hidden');
  feedback.textContent = `Fetching ${selectedType}...`;
  result.innerHTML = '';

  // Simulate AJAX call – replace with real endpoint later
  fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type: selectedType })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch download links.');
      return res.json();
    })
    .then(data => {
      feedback.classList.add('hidden');
      if (data.links && data.links.length > 0) {
        result.innerHTML = data.links.map(link =>
          `<a href="${link}" target="_blank" download>Download ${selectedType}</a>`
        ).join('');
      } else {
        result.innerHTML = '<p>No downloadable content found.</p>';
      }
    })
    .catch(err => {
      feedback.classList.remove('hidden');
      feedback.textContent = 'Error: ' + err.message;
    });
});
