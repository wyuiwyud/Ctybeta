import type { APIRoute } from 'astro';

// Static output (Vercel, no adapter): route này phải prerender, nếu không
// `astro build` sẽ fail với NoAdapterInstalled.
export const prerender = true;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.error('>>> [CLIENT REPORTED ERROR]:', JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 400 });
  }
};
