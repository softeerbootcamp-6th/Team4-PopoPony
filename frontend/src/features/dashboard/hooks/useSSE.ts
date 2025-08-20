import { useEffect, useRef, useState } from 'react';
import { type EscortStatusProps } from '@dashboard/types';

// SSE 이벤트 타입 정의
interface LocationResponse {
  escortId: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface EscortStatusResponse {
  escortId: number;
  escortStatus: EscortStatusProps;
  timestamp: string;
}

// 한국 시간으로 변환하는 유틸리티 함수
const convertToKoreaTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

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
      const koreaTime = convertToKoreaTime(data.timestamp);
      const locationWithKoreaTime = { ...data, timestamp: koreaTime };
      console.log('helper-location', locationWithKoreaTime);
      setHelperLocations(locationWithKoreaTime);
    });

    es.addEventListener('patient-location', (e) => {
      const data: LocationResponse = JSON.parse(e.data);
      const koreaTime = convertToKoreaTime(data.timestamp);
      const locationWithKoreaTime = { ...data, timestamp: koreaTime };
      console.log('patient-location', locationWithKoreaTime);
      setPatientLocations(locationWithKoreaTime);
    });

    es.addEventListener('status', (e) => {
      const data: EscortStatusResponse = JSON.parse(e.data);
      const koreaTime = convertToKoreaTime(data.timestamp);
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
