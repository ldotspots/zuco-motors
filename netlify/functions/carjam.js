exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const plate = (event.queryStringParameters?.plate || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!plate) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing plate parameter' }) };
  }

  const apiKey = process.env.CARJAM_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'CARJAM_API_KEY not set' }) };
  }

  const url = `https://www.carjam.co.nz/api/car/?key=${encodeURIComponent(apiKey)}&plate=${encodeURIComponent(plate)}&basic=1&f=json&translate=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return { statusCode: res.ok ? 200 : 502, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'CarJam request failed' }) };
  }
};
