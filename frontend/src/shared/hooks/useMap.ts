import { useEffect, useState } from 'react';
import type { MarkerType, RouteSegment, TMap } from '@types';
import {
  DEFAULT_ZOOM_LEVEL,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@dashboard/constants';

const { Tmapv3 } = window;

export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<TMap | null>(null);
  const [isTmapLoaded, setIsTmapLoaded] = useState(false);

  // 지도 초기화 함수
  const initMap = () => {
    if (!mapRef?.current || mapRef.current?.firstChild || mapInstance || !isTmapLoaded) {
      return null;
    }

    try {
      const map = new Tmapv3.Map(mapRef.current, {
        center: new Tmapv3.LatLng(INITIAL_LATITUDE, INITIAL_LONGITUDE),
        width: '100%',
        height: '100%',
        zoom: DEFAULT_ZOOM_LEVEL,
        zoomControl: false,
      });

      map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
      setMapInstance(map);

      return map;
    } catch (error) {
      console.error('지도 초기화 오류:', error);
      return null;
    }
  };

  const setCenter = (lat: number, lng: number) => {
    if (mapInstance) {
      mapInstance.setCenter(new Tmapv3.LatLng(lat, lng));
      mapInstance.setZoom(DEFAULT_ZOOM_LEVEL);
    }
  };

  const setCurrentLocation = () => {
    if (mapInstance) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.setCenter(new Tmapv3.LatLng(latitude, longitude));
          mapInstance.setZoom(DEFAULT_ZOOM_LEVEL);
        });
      }
    }
  };

  const addMarker = (lat: number, lng: number, type?: MarkerType) => {
    if (!mapInstance) {
      return null;
    }

    const iconPath = () => {
      switch (type) {
        case 'marker1':
          return '/icons/marker1.svg';
        case 'marker2':
          return '/icons/marker2.svg';
        case 'marker3':
          return '/icons/marker3.svg';
        case 'home':
          return '/icons/marker-home.svg';
        case 'hospital':
          return '/icons/marker-hospital.svg';
        case 'me':
          return '/icons/marker-me.svg';
        default:
          return undefined;
      }
    };

    const marker = new Tmapv3.Marker({
      position: new Tmapv3.LatLng(lat, lng),
      map: mapInstance,
      icon: iconPath(),
    });

    return marker;
  };

  const addCustomMarker = (lat: number, lng: number, name: string, imageUrl: string) => {
    if (!mapInstance) {
      return null;
    }

    const marker = new Tmapv3.Marker({
      position: new Tmapv3.LatLng(lat, lng),
      map: mapInstance,
      iconHTML: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
          <div style="font-size: 16px; font-weight: 600; color: #32363E; background-color: #ffffff; padding: 5px 10px; border-radius: 5px;">
            ${name}
          </div>
          <div style="position: relative;">
            <div style="
              width: 65px;
              height: 65px;
              border-radius: 50%;
              border: 2px solid white;
              background-color: #00C89A;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            ">
              <div style="
                position: absolute;
                top: 5px;
                left: 5px;
                width: 55px;
                height: 55px;
                overflow: hidden;
                border-radius: 50%;
              ">
                <img
                  src="${imageUrl}"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  alt="프로필"
                />
              </div>
            </div>
          </div>
        </div>
      `,
    });

    return marker;
  };

  const addUserLocationMarker = () => {
    if (!mapInstance) {
      return null;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        addMarker(latitude, longitude, 'me');
      });
    }
  };

  const addPolyline = (segments: RouteSegment[]) => {
    if (!mapInstance) {
      return;
    }

    try {
      // 1. 모든 고유 지점 추출 (중복 방지)
      const uniquePoints = new Map<string, { lat: number; lng: number; markerType: string }>();

      segments.forEach((segment) => {
        const startPoint = segment.pathCoordinates[0];
        const endPoint = segment.pathCoordinates[segment.pathCoordinates.length - 1];

        const startKey = `${startPoint[0]},${startPoint[1]}`;
        const endKey = `${endPoint[0]},${endPoint[1]}`;

        uniquePoints.set(startKey, {
          lat: startPoint[0],
          lng: startPoint[1],
          markerType: segment.startMarkerType,
        });
        uniquePoints.set(endKey, {
          lat: endPoint[0],
          lng: endPoint[1],
          markerType: segment.endMarkerType,
        });
      });

      // 2. 고유 지점에만 마커 생성
      uniquePoints.forEach((point) => {
        addMarker(point.lat, point.lng, point.markerType as MarkerType);
      });

      // 3. 모든 경로 그리기
      mapInstance.on('ConfigLoad', () => {
        segments.forEach((segment) => {
          if (segment.pathCoordinates.length < 2) {
            console.warn('경로 좌표가 부족합니다.');
            return;
          }

          // LatLng 객체 배열 생성
          const path = segment.pathCoordinates.map(([lat, lng]) => new Tmapv3.LatLng(lat, lng));

          // Tmap 공식 문서 방식으로 폴리라인 생성
          new Tmapv3.Polyline({
            path: path,
            strokeColor: '#39bdea',
            strokeWeight: 6,
            direction: true,
            map: mapInstance,
          });
        });
      });

      // 4. 경로에 맞게 지도 중심과 줌 조정 (첫 번째 세그먼트 기준)
      if (segments.length > 0 && segments[0].pathCoordinates.length > 0) {
        const middleIndex = Math.floor(segments[0].pathCoordinates.length / 2);
        const middlePoint = segments[0].pathCoordinates[middleIndex];
        mapInstance.setCenter(new Tmapv3.LatLng(middlePoint[0], middlePoint[1]));
        mapInstance.setZoom(7);
      }
    } catch (error) {
      console.error('폴리라인 그리기 오류:', error);
    }
  };

  // Tmap API 로딩 확인 및 지도 초기화
  useEffect(() => {
    // 1. Tmap API 로딩 확인
    const checkTmapLoaded = () => {
      if (Tmapv3) {
        setIsTmapLoaded(true);
      } else {
        setTimeout(checkTmapLoaded, 100);
      }
    };

    checkTmapLoaded();
  }, []);

  // 지도 초기화 (Tmap API 로딩 완료 후)
  useEffect(() => {
    if (!isTmapLoaded) return;

    const map = initMap();
    if (!map) return;
  }, [mapRef, isTmapLoaded]);

  return {
    mapInstance,
    isTmapLoaded,
    setCenter,
    setCurrentLocation,
    addMarker,
    addCustomMarker,
    addUserLocationMarker,
    addPolyline,
    initMap,
  };
};
