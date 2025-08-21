import { useEffect, useState } from 'react';
import type { MarkerType, Position, TMap, TMapPolyline } from '@types';
import {
  DEFAULT_POLYLINE_COLOR,
  DEFAULT_POLYLINE_STROKE_WEIGHT,
  DEFAULT_ZOOM_LEVEL,
  INITIAL_LATITUDE,
  INITIAL_LONGITUDE,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@dashboard/constants';
import type { RouteSimpleResponse } from '@customer/types';

const { Tmapv3 } = window;

export const useMap = (mapRef: React.RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<TMap | null>(null);
  const [isTmapLoaded, setIsTmapLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [polylineInstances, setPolylineInstances] = useState<Map<string, TMapPolyline>>(new Map());

  // 지도 초기화 함수 (초기 로딩시 사용되는 함수)
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
      });

      map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);

      // ConfigLoad 이벤트 리스너 추가
      map.on('ConfigLoad', () => {
        setIsMapReady(true);
      });

      setMapInstance(map);

      return map;
    } catch (error) {
      console.error('지도 초기화 오류:', error);
      return null;
    }
  };

  // 폴리라인 제거 함수
  const resetPolyline = (name?: string) => {
    if (name) {
      // 특정 이름의 polyline 제거
      const polyline = polylineInstances.get(name);
      if (polyline) {
        polyline.setMap(null);
        setPolylineInstances((prev) => {
          const newMap = new Map(prev);
          newMap.delete(name);
          return newMap;
        });
      }
    } else {
      // 모든 polyline 제거
      polylineInstances.forEach((polyline) => {
        polyline.setMap(null);
      });
      setPolylineInstances(new Map());
    }
  };

  // 지도를 특정 위치(위도, 경도)로 이동
  const setCenter = (lat: number, lng: number) => {
    if (mapInstance) {
      mapInstance.setCenter(new Tmapv3.LatLng(lat, lng));
      mapInstance.setZoom(DEFAULT_ZOOM_LEVEL);
    }
  };

  const setZoom = (zoom: number) => {
    if (mapInstance) {
      mapInstance.setZoom(zoom);
    }
  };

  // 지도를 현재 위치로 이동
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

  // 마커 추가 함수
  const addMarker = (lat: number, lng: number, type?: MarkerType, label?: string) => {
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
      label: label,
    });

    return marker;
  };

  // 커스텀 마커 추가 함수 (프로필 이미지 표시)
  const addCustomMarker = (lat?: number, lng?: number, name?: string, imageUrl?: string) => {
    if (!mapInstance || !lat || !lng || !name || !imageUrl) {
      return null;
    }

    const previewUrl = `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;

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
                  src="${previewUrl}"
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

  // 지도 생성 이후 폴리라인 추가하는 함수
  // 폴리라인 인스턴스 반환
  const addPolyline = (positions: Position[], name: string) => {
    if (!mapInstance) {
      return;
    }

    if (positions.length < 2) {
      console.warn('경로 좌표가 부족합니다.');
      return;
    }

    const existingPolyline = polylineInstances.get(name);
    if (existingPolyline) {
      existingPolyline.setMap(null);
    }

    const path = positions.map(({ lat, lon }) => new Tmapv3.LatLng(lat, lon));

    try {
      const polyline = new Tmapv3.Polyline({
        path,
        strokeColor: DEFAULT_POLYLINE_COLOR,
        strokeWeight: DEFAULT_POLYLINE_STROKE_WEIGHT,
        map: mapInstance,
      });

      setPolylineInstances((prev) => {
        const newMap = new Map(prev);
        newMap.set(name, polyline);
        return newMap;
      });
    } catch (error) {
      console.error('polyline 생성 실패:', error);
    }
  };

  // n개의 좌표로 지도 영역을 조정하는 함수
  const fitBoundsToCoordinates = (coordinates: Array<{ lat: number; lon: number }>) => {
    if (!mapInstance || coordinates.length === 0) return;

    const bounds = new Tmapv3.LatLngBounds();
    coordinates.forEach(({ lat, lon }) => {
      bounds.extend(new Tmapv3.LatLng(lat, lon));
    });

    mapInstance.fitBounds(bounds, {
      left: 50,
      top: 50,
      right: 50,
      bottom: 30,
    });
  };

  // 경로 폴리라인 추가 (만남 -> 병원 -> 복귀)
  // 초기 로딩시 사용되는 함수로, ConfigLoad 이벤트 발생 후 폴리라인 추가하며 폴리라인 인스턴스 반환 안함
  const addRoutePolyline = (route: RouteSimpleResponse) => {
    if (!mapInstance) {
      return;
    }

    try {
      const {
        meetingLocationInfo,
        hospitalLocationInfo,
        returnLocationInfo,
        meetingToHospital,
        hospitalToReturn,
      } = route;

      const isSameStartEnd =
        meetingLocationInfo.lat === returnLocationInfo.lat &&
        meetingLocationInfo.lon === returnLocationInfo.lon;

      addMarker(
        meetingLocationInfo.lat,
        meetingLocationInfo.lon,
        'home',
        meetingLocationInfo.placeName
      );
      addMarker(
        hospitalLocationInfo.lat,
        hospitalLocationInfo.lon,
        'hospital',
        hospitalLocationInfo.placeName
      );
      if (!isSameStartEnd) {
        addMarker(
          returnLocationInfo.lat,
          returnLocationInfo.lon,
          'home',
          returnLocationInfo.placeName
        );
      }

      const meetingToHospitalPath = meetingToHospital.map(
        ({ lat, lon }) => new Tmapv3.LatLng(lat, lon)
      );
      const hospitalToReturnPath = hospitalToReturn.map(
        ({ lat, lon }) => new Tmapv3.LatLng(lat, lon)
      );

      mapInstance.on('ConfigLoad', () => {
        new Tmapv3.Polyline({
          path: meetingToHospitalPath,
          strokeColor: DEFAULT_POLYLINE_COLOR,
          strokeWeight: DEFAULT_POLYLINE_STROKE_WEIGHT,
          map: mapInstance,
        });
        new Tmapv3.Polyline({
          path: hospitalToReturnPath,
          strokeColor: DEFAULT_POLYLINE_COLOR,
          strokeWeight: DEFAULT_POLYLINE_STROKE_WEIGHT,
          map: mapInstance,
        });
      });

      // 좌표 배열 생성
      const coordinates = [
        { lat: meetingLocationInfo.lat, lon: meetingLocationInfo.lon },
        { lat: hospitalLocationInfo.lat, lon: hospitalLocationInfo.lon },
        { lat: returnLocationInfo.lat, lon: returnLocationInfo.lon },
      ];

      // 지도 영역 조정
      fitBoundsToCoordinates(coordinates);
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
    isMapReady,
    polylineInstances,
    setCenter,
    setZoom,
    setCurrentLocation,
    addMarker,
    addCustomMarker,
    addUserLocationMarker,
    addPolyline,
    addRoutePolyline,
    resetPolyline,
    fitBoundsToCoordinates,
  };
};
