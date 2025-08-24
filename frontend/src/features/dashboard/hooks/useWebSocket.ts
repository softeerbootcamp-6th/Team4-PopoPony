import { useEffect, useRef, useState, useCallback } from 'react';
import { type EscortStatusProps } from '@dashboard/types';

// WebSocket 메시지 타입 정의
interface LocationPayload {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface StatusPayload {
  escortStatus: EscortStatusProps;
  timestamp: string;
}

// SSE와 일치하는 반환 타입
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

interface LocationRequestPayload {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracyMeters: number;
  seq: number;
}

interface WebSocketMessage {
  type: 'helper-location' | 'patient-location' | 'status';
  payload: LocationPayload | StatusPayload | string;
}

interface LocationRequest {
  type: 'location';
  payload: LocationRequestPayload;
}

// TODO: console.log 제거
const useWebSocket = (escortId: string, role: string) => {
  const [helperLocations, setHelperLocations] = useState<LocationResponse | null>(null);
  const [patientLocations, setPatientLocations] = useState<LocationResponse | null>(null);
  const [escortStatuses, setEscortStatuses] = useState<EscortStatusResponse | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'error' | 'disconnected'
  >('connecting');
  const [nchanStatus, setNchanStatus] = useState<
    'connecting' | 'connected' | 'error' | 'disconnected'
  >('connecting');

  const wsRef = useRef<WebSocket | null>(null);
  const nchanRef = useRef<EventSource | null>(null);
  const seqRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // 위치 정보 전송 함수
  const sendLocation = useCallback(
    (latitude: number, longitude: number, accuracyMeters: number = 15.2) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const locationRequest: LocationRequest = {
          type: 'location',
          payload: {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            accuracyMeters,
            seq: seqRef.current++,
          },
        };

        wsRef.current.send(JSON.stringify(locationRequest));
        console.log('Location sent:', locationRequest);
      } else {
        console.warn('WebSocket is not connected');
      }
    },
    []
  );

  // 메시지 처리 함수
  const handleMessage = useCallback(
    (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data);
        console.log('Message received:', message);

        switch (message.type) {
          case 'helper-location':
            if (typeof message.payload === 'object' && 'latitude' in message.payload) {
              const locationPayload = message.payload as LocationPayload;
              const koreaTime = new Date(locationPayload.timestamp);
              const locationWithKoreaTime: LocationResponse = {
                escortId: Number(escortId),
                latitude: locationPayload.latitude,
                longitude: locationPayload.longitude,
                timestamp: koreaTime,
              };
              console.log('helper-location', locationWithKoreaTime);
              setHelperLocations(locationWithKoreaTime);
            } else if (message.payload === 'NO_LOCATION') {
              console.log('helper-location: NO_LOCATION');
              setHelperLocations(null);
            }
            break;

          case 'patient-location':
            if (typeof message.payload === 'object' && 'latitude' in message.payload) {
              const locationPayload = message.payload as LocationPayload;
              const koreaTime = new Date(locationPayload.timestamp);
              const locationWithKoreaTime: LocationResponse = {
                escortId: Number(escortId),
                latitude: locationPayload.latitude,
                longitude: locationPayload.longitude,
                timestamp: koreaTime,
              };
              console.log('patient-location', locationWithKoreaTime);
              setPatientLocations(locationWithKoreaTime);
            } else if (message.payload === 'NO_LOCATION') {
              console.log('patient-location: NO_LOCATION');
              setPatientLocations(null);
            }
            break;

          case 'status':
            if (typeof message.payload === 'object' && 'escortStatus' in message.payload) {
              const statusPayload = message.payload as StatusPayload;
              const koreaTime = new Date(statusPayload.timestamp);
              const statusWithKoreaTime: EscortStatusResponse = {
                escortId: Number(escortId),
                escortStatus: statusPayload.escortStatus,
                timestamp: koreaTime,
              };
              console.log('status', statusWithKoreaTime);
              setEscortStatuses(statusWithKoreaTime);
            }
            break;

          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    },
    [escortId]
  );

  useEffect(() => {
    if (!escortId) return;

    const connectWebSocket = () => {
      // WebSocket 연결 (위치 전송용)
      const wsUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('https://', 'wss://').replace('http://', 'ws://')}/api/realtime/ws?escortId=${encodeURIComponent(escortId)}&role=${encodeURIComponent(role)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = (event) => {
        console.log('WebSocket connected', event);
        setConnectionStatus('connected');
        // 재연결 타이머 클리어
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error', error);
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event);
        setConnectionStatus('disconnected');

        // 자동 재연결 (정상적인 종료가 아닌 경우)
        if (event.code !== 1000 && event.code !== 1001) {
          console.log('Attempting to reconnect WebSocket...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000); // 3초 후 재연결
        }
      };
    };

    // Nchan 브로드캐스팅 채널 연결 (수신용)
    const nchanUrl = `${import.meta.env.VITE_API_BASE_URL}/sub/escorts/${escortId}`;
    const nchan = new EventSource(nchanUrl, { withCredentials: true });
    nchanRef.current = nchan;

    nchan.onopen = (event) => {
      console.log('Nchan connected', event);
      setNchanStatus('connected');
    };

    nchan.onmessage = (event) => {
      handleMessage(event.data);
    };

    nchan.onerror = (error) => {
      console.warn('Nchan error', error);
      setNchanStatus('error');
    };

    connectWebSocket();

    return () => {
      setConnectionStatus('disconnected');
      setNchanStatus('disconnected');

      // 재연결 타이머 클리어
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Component unmounting');
      }
      if (nchan.readyState === EventSource.OPEN) {
        nchan.close();
      }
    };
  }, [escortId, role, handleMessage]);

  return {
    helperLocations,
    patientLocations,
    escortStatuses,
    connectionStatus,
    nchanStatus,
    sendLocation,
  };
};

export default useWebSocket;
