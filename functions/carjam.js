// Cloudflare Pages Function - CarJam API Proxy
// This proxies requests to CarJam to keep the API key secret

export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Get plate from query string
  const url = new URL(request.url);
  const plate = (url.searchParams.get('plate') || '').trim().toUpperCase().replace(/\s+/g, '');

  if (!plate) {
    return new Response(
      JSON.stringify({ error: 'Missing plate parameter' }),
      { status: 400, headers }
    );
  }

  // Get API key from environment
  const apiKey = env.CARJAM_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'CARJAM_API_KEY not configured' }),
      { status: 500, headers }
    );
  }

  // Call CarJam API
  const carjamUrl = `https://www.carjam.co.nz/api/car/?key=${encodeURIComponent(apiKey)}&plate=${encodeURIComponent(plate)}&basic=1&f=json&translate=1`;

  try {
    const res = await fetch(carjamUrl);
    const data = await res.json();
    return new Response(
      JSON.stringify(data),
      { status: res.ok ? 200 : 502, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'CarJam request failed', details: err.message }),
      { status: 502, headers }
    );
  }
}
