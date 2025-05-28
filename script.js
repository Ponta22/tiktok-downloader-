document.getElementById('download-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const url = document.getElementById('url-input').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.classList.add('hidden');

  if (!url) return alert("Masukkan URL TikTok!");

  try {
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!data.status) {
      alert(data.message || "Gagal mengunduh video");
      return;
    }

    document.getElementById('video-title').textContent = data.metadata.title;
    document.getElementById('video-author').textContent = `Author: ${data.metadata.author.id}`;
    document.getElementById('video-thumb').src = data.metadata.author.avatar;
    document.getElementById('download-hd').href = data.download.hd;
    document.getElementById('download-normal').href = data.download.original;

    resultDiv.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghubungi server.");
  }
});
