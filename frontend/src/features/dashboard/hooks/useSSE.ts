import { useEffect, useRef, useState } from 'react';

interface SSEEvent {
  type: string;
  data: {
    [key: string]: unknown;
  };
  timestamp?: string;
}

const useSSE = (escortId: string, role: string) => {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'error' | 'disconnected'
  >('connecting');
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!escortId) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/realtime/escorts/${escortId}/sse?role=${encodeURIComponent(role)}`;

    const es = new EventSource(url, { withCredentials: true });
    sourceRef.current = es;

    es.onopen = (e) => {
      console.log('SSE connected', e);
      setConnectionStatus('connected');
    };

    es.addEventListener('helper-location', (e) => {
      console.log('helper-location', JSON.parse(e.data));
      setEvents((prev) => [...prev, { type: 'helper-location', data: JSON.parse(e.data) }]);
    });

    es.addEventListener('patient-location', (e) => {
      console.log('patient-location', JSON.parse(e.data));
      setEvents((prev) => [...prev, { type: 'patient-location', data: JSON.parse(e.data) }]);
    });

    es.addEventListener('status', (e) => {
      console.log('status', JSON.parse(e.data));
      setEvents((prev) => [...prev, { type: 'status', data: JSON.parse(e.data) }]);
    });

    es.onerror = (err) => {
      console.warn('SSE error', err);
      setConnectionStatus('error');
      // 필요시 사용자 알림/재연결 로직 추가
    };

    return () => {
      setConnectionStatus('disconnected');
      es.close();
    };
  }, [escortId, role]);

  return { events, connectionStatus };
};

export default useSSE;
