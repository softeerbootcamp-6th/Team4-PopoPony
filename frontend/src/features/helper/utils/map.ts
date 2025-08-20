import {
  DEFAULT_ZOOM_LEVEL,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@dashboard/constants';
import type { Position } from '@types';

interface MapCenter {
  lat: number;
  lng: number;
}

interface CenterAndZoom {
  center: MapCenter;
  zoom: number;
}

const createCenter = (lat: number, lng: number): MapCenter => ({
  lat,
  lng,
});

const calculateZoomFromDistance = (distance: number): number => {
  const ZOOM_SCALE_BASE = 0.000045;
  return Math.ceil(
    Math.min(
      Math.max(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL - Math.log2(distance / ZOOM_SCALE_BASE)),
      MAX_ZOOM_LEVEL
    )
  );
};

export const calculateCenterAndZoom = (point1?: Position, point2?: Position): CenterAndZoom => {
  // 두 점이 모두 없는 경우 기본값 반환
  if (!point1 && !point2) {
    return {
      center: createCenter(INITIAL_LATITUDE, INITIAL_LONGITUDE),
      zoom: DEFAULT_ZOOM_LEVEL,
    };
  }

  // 한 점만 있는 경우 해당 점을 중심으로 설정
  const singlePoint = point1 || point2;
  if (singlePoint && !(point1 && point2)) {
    return {
      center: createCenter(singlePoint.lat, singlePoint.lon),
      zoom: DEFAULT_ZOOM_LEVEL,
    };
  }

  // 두 점이 모두 있는 경우 중점 계산 및 거리 기반 줌 설정
  const latitudeDistance = Math.abs(point1!.lat - point2!.lat);
  const center = createCenter(
    (point1!.lat + point2!.lat) / 2 + latitudeDistance / 3,
    (point1!.lon + point2!.lon) / 2
  );
  const distance = Math.sqrt(
    Math.pow(point1!.lat - point2!.lat, 2) + Math.pow(point1!.lon - point2!.lon, 2)
  );
  const zoom = calculateZoomFromDistance(distance);

  return { center, zoom };
};

// 1분 미만일때는 '방금'
// 나머지는 분기준 숫자
export const updatedBefore = (timestamp?: Date) => {
  if (!timestamp) return undefined;

  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return '방금';
  return minutes.toString();
};
