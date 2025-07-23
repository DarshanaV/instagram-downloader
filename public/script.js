document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('download-form');
  const urlInput = document.getElementById('url');
  const typeSelect = document.getElementById('type');
  const feedback = document.getElementById('feedback');
  const spinner = document.getElementById('spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();
    const type = typeSelect.value;

    if (!url) {
      feedback.innerHTML = '❗ Please enter a valid Instagram URL.';
      return;
    }

    feedback.innerHTML = '';
    spinner.style.display = 'inline-block';

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, type })
      });

      const data = await response.json();
      spinner.style.display = 'none';

      if (!Array.isArray(data.links) || data.links.length === 0) {
        feedback.innerHTML = '⚠️ No downloadable content found.';
        return;
      }

      feedback.innerHTML = '🎉 Download links:';
      data.links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link;
        a.innerText = `Download File ${index + 1}`;
        a.target = '_blank';
        a.className = 'download-btn';
        feedback.appendChild(document.createElement('br'));
        feedback.appendChild(a);
      });

    } catch (err) {
      spinner.style.display = 'none';
      feedback.innerHTML = '❌ Error retrieving download links.';
      console.error(err);
    }
  });
});
