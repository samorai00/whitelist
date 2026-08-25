export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { handle, wallet } = req.body || {};
    const cleanHandle = String(handle || '').trim();
    const cleanWallet = String(wallet || '').trim();

    if (!cleanHandle || cleanHandle.length > 100) return res.status(400).json({ error: 'Invalid X handle.' });
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) return res.status(400).json({ error: 'Invalid EVM wallet address.' });

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return res.status(500).json({ error: 'Server is not configured. Add Supabase environment variables in Vercel.' });

    const response = await fetch(`${url}/rest/v1/whitelist_applications`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ handle: cleanHandle, wallet_address: cleanWallet })
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 409) return res.status(409).json({ error: 'This wallet is already registered.' });
      console.error(text);
      return res.status(500).json({ error: 'Could not save the application.' });
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}