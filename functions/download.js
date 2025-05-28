const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  const { url } = JSON.parse(event.body);

  const baseUrl = 'https://id.tikmate.app/ ';
  const apiUrl = 'https://api.tikmate.app/api/lookup ';

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const baseRes = await axios.get(baseUrl, { headers });
    const $ = cheerio.load(baseRes.data);
    const formInputName = $('form input[name="url"]').attr('name') || 'url';
    const postData = new URLSearchParams({ [formInputName]: url });

    const postRes = await axios.post(apiUrl, postData, { headers });
    const data = postRes.data;

    if (!data.success) throw new Error(data.message);

    const result = {
      status: true,
      metadata: {
        title: data.desc,
        author: {
          id: data.author_id,
          avatar: data.cover
        }
      },
      download: {
        original: `${baseUrl}download/${data.token}/${data.id}.mp4`,
        hd: `${baseUrl}download/${data.token}/${data.id}.mp4?hd=1`
      }
    };

    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ status: false, message: e.toString() }) };
  }
};
