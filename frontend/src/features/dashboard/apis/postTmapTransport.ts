type TmapTransportRequest = {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  lang?: 0 | 1;
  format?: 'json' | 'xml';
};

// Response 타입은 필요 시 확장
export const postTmapTransport = async ({
  startX,
  startY,
  endX,
  endY,
  lang = 0,
  format = 'json',
}: TmapTransportRequest) => {
  const appKey = import.meta.env.VITE_TMAP_TRANSPORT_API_KEY as string;
  if (!appKey) throw new Error('TMAP appKey is missing. Set TMAP_TRANSPORT_API_KEY in .env');

  const res = await fetch('https://apis.openapi.sk.com/transit/routes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appKey,
    },
    body: JSON.stringify({ startX, startY, endX, endY, count: 1, lang, format }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMAP request failed: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
};

export default postTmapTransport;
