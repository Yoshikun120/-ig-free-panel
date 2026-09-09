function normalizeInstagramUrl(raw) {
  const value = String(raw || '').trim();
  let u;
  try { u = new URL(value); } catch { return null; }

  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (host !== 'instagram.com') return null;

  const parts = u.pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const kind = parts[0].toLowerCase();
  if (!['p', 'reel', 'reels', 'tv'].includes(kind)) return null;
  const id = parts[1].trim();
  if (!/^[A-Za-z0-9_-]+$/.test(id)) return null;

  // Send a clean canonical URL to the provider (no tracking/query/hash data).
  const canonicalKind = kind === 'reels' ? 'reel' : kind;
  return `https://www.instagram.com/${canonicalKind}/${id}/`;
}

async function autoThRequest(params) {
  const response = await fetch('https://auto-th.com/api/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, text/plain, */*'
    },
    body: new URLSearchParams(params)
  });

  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }

  return { response, data, text };
}

async function getInstagramLikeServices() {
  const { response, data, text } = await autoThRequest({
    key: process.env.AUTO_TH_API_KEY,
    action: 'services'
  });

  if (!response.ok) throw new Error(`AUTO-TH HTTP ${response.status}`);
  if (!Array.isArray(data)) {
    throw new Error(data?.error || text || 'AUTO-TH ไม่ส่งรายการบริการกลับมา');
  }

  return data.filter(x => {
    const text = `${x.name || ''} ${x.category || ''} ${x.type || ''}`.toLowerCase();
    return /instagram|\big\b/.test(text) && /like|likes|ไลก์|ถูกใจ/.test(text);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { link } = req.body || {};
    const normalizedLink = normalizeInstagramUrl(link);
    if (!normalizedLink) {
      return res.status(400).json({ ok: false, error: 'ลิงก์ต้องเป็น Instagram โพสต์หรือ Reel ที่ถูกต้อง เช่น https://www.instagram.com/reel/ABC123/' });
    }

    const services = await getInstagramLikeServices();
    if (!services.length) {
      return res.status(404).json({ ok: false, error: 'ไม่พบบริการ Instagram Likes ในบัญชี AUTO-TH' });
    }

    const preferred = services.find(x => Number(x.min || 0) <= 100 && Number(x.max || Infinity) >= 100) || services[0];
    const min = Math.max(1, Number(preferred.min || 1));
    const max = Math.max(min, Number(preferred.max || 1000000));
    const quantity = Math.min(Math.max(100, min), max);

    const { response, data, text } = await autoThRequest({
      key: process.env.AUTO_TH_API_KEY,
      action: 'add',
      service: String(preferred.service),
      link: normalizedLink,
      quantity: String(quantity)
    });

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: `AUTO-TH HTTP ${response.status}` });
    }
    if (!data || !data.order) {
      return res.status(502).json({
        ok: false,
        error: data?.error || data?.message || text || 'AUTO-TH ไม่สามารถสร้างคำสั่งซื้อได้'
      });
    }

    return res.status(200).json({
      ok: true,
      order: data.order,
      service: preferred.name,
      quantity,
      link: normalizedLink
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
}
