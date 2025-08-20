import { useEffect, useRef, useState } from 'react';
import { type EscortStatusProps } from '@dashboard/types';

// SSE 이벤트 타입 정의
interface LocationResponse {
  escortId: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface EscortStatusResponse {
  escortId: number;
  escortStatus: EscortStatusProps;
  timestamp: Date;
}

// TODO: console.log 제거
const useSSE = (escortId: string, role: string) => {
  const [helperLocations, setHelperLocations] = useState<LocationResponse | null>(null);
  const [patientLocations, setPatientLocations] = useState<LocationResponse | null>(null);
  const [escortStatuses, setEscortStatuses] = useState<EscortStatusResponse | null>(null);
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
      const data: LocationResponse = JSON.parse(e.data);
      const koreaTime = new Date(data.timestamp);
      const locationWithKoreaTime = { ...data, timestamp: koreaTime };
      console.log('helper-location', locationWithKoreaTime);
      setHelperLocations(locationWithKoreaTime);
    });

    es.addEventListener('patient-location', (e) => {
      const data: LocationResponse = JSON.parse(e.data);
      const koreaTime = new Date(data.timestamp);
      const locationWithKoreaTime = { ...data, timestamp: koreaTime };
      console.log('patient-location', locationWithKoreaTime);
      setPatientLocations(locationWithKoreaTime);
    });

    es.addEventListener('status', (e) => {
      const data: EscortStatusResponse = JSON.parse(e.data);
      const koreaTime = new Date(data.timestamp);
      const statusWithKoreaTime = { ...data, timestamp: koreaTime };
      console.log('status', statusWithKoreaTime);
      setEscortStatuses(statusWithKoreaTime);
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

  return {
    helperLocations,
    patientLocations,
    escortStatuses,
    connectionStatus,
  };
};

export default useSSE;
