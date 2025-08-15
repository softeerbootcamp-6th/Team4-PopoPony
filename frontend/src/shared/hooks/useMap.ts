import { useEffect, useState } from 'react';
import type { TMap } from '@types';
import { routeVertices } from './routeData';

const DEFAULT_ZOOM_LEVEL = 16;
const INITIAL_LATITUDE = 37.566481622437934;
const INITIAL_LONGITUDE = 126.98502302169841;
const MAX_ZOOM_LEVEL = 17;
const MIN_ZOOM_LEVEL = 7;

const { Tmapv3 } = window;

export const useMap = (mapRef?: React.RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<TMap | null>(null);
  const [isTmapLoaded, setIsTmapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const setCurrentLocation = () => {
    if (mapInstance && userLocation) {
      mapInstance.setCenter(new Tmapv3.LatLng(userLocation.lat, userLocation.lng));
      mapInstance.setZoom(16);
    }
  };

  // 사용자 위치 가져오기
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          // 위치 정보를 가져올 수 없으면 기본 위치 사용
          setUserLocation({ lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setUserLocation({ lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE });
    }
  }, []);

  // Tmap API 로딩 확인
  useEffect(() => {
    const checkTmapLoaded = () => {
      if (Tmapv3) {
        setIsTmapLoaded(true);
      } else {
        setTimeout(checkTmapLoaded, 100);
      }
    };

    checkTmapLoaded();
  }, []);

  // 지도 초기화 및 경로 그리기
  useEffect(() => {
    if (!mapRef?.current || !isTmapLoaded || !userLocation || mapInstance) {
      return;
    }

    try {
      const map = new Tmapv3.Map(mapRef.current, {
        center: new Tmapv3.LatLng(userLocation.lat, userLocation.lng),
        width: '100%',
        height: '100%',
        zoom: DEFAULT_ZOOM_LEVEL,
        zoomControl: false,
      });

      map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
      setMapInstance(map);

      // 사용자 위치에 마커 추가
      const marker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(userLocation.lat, userLocation.lng),
        map: map,
        icon: 'https://todoc-s3-bucket.s3.ap-northeast-2.amazonaws.com/uploads/patient/7617b42b-b090-46a1-82bb-f3628371cb17.png?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAwaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAMCkx3NWlqHLkiuuoa0tS3gQvV9U9T3OU3vJKqDs4FZ9AiAp728YZD1RozRStAzwSXKK%2BwhytwF3TTy6%2FJLUtxjDyCrKBQhVEAMaDDY5ODY3MjkzNTEzMiIMjC8ilrpKlVYKAShAKqcFoQ4rCsciuTDMCqxKukG%2Fh1WWMTbinDmWoMI99wLA5%2FmAz7xaqM274DitTIHlXNTuvoKOrrhkoCFD4umCNk0LqEmKnysgXXQ409d63kIaJ4velXnuFW8mGBXygRMsp%2B3%2BraB2t2no8mb0M5pLN%2BcVWiIcgaFoxOjftlkDCIAe2LX481rphaZJll6fiNovIDnnm4ZUEe1gQb6gC8OuMpTgugIOdlnQDrX7TuqQWk57Qx1Wg2EZH3fD4C8VC1AkhMQbB4fzhIo9jhNeeZIvhHdpfJuHbgyKdnweba4uSzjqg2gCwM8ljxA2xHJFE5EgpKbgwZvds9UoxBCI%2BDShdGQrQdkD%2B5ZW3DXeRSv7mVJsyJA3YvPkWXx%2BJRmb31nAnBwWZuzZchvVZEBtiTNiaQAyOLMQ7hcGn3tcDyjQEHZvKFhBcCu5A0gIzCXXyiEERvS7Gn44JBiXTD6vf08se98osbzX70HvPOZ%2BamvbYINVtkL7bN94blpTp6EnOKE%2BrDWMpASJx%2BBVo%2B8NP0ZK6wkf2ceJDxhnuXCXU2jdUKklYevD1OcANJb5d%2BB6gTpxN42dLn6%2FQh3IbwaSTi9VwXCG%2FtODGbexXYEw8xqiRdiLp0NeAfJIDebO0kWeO8kLJ4kgN0GfyFaO1P%2FJ0JPCZ%2F0nbMIdyzbmUnt0z%2BSaVm6eNqpANp9fP1R9PX%2FefCyN7d8e6FBXwaICMezBxwj2IIdbb4urLM9tn3q33DwQ6Ac%2BpAW%2FCoR%2BjF%2Bmb2U7xdL%2FENbadoKiUPVpeUu38l0dt1tO8t5diMhei4Un%2BU6bMH%2FTzW9667IeG8GMRxZ6%2FLEmG7YQsCgVl%2Bm8ECTevTTCl7Xo%2BvHy6H0S68Dnn%2FumhOnDkj14%2BLswpTzoQa8UN%2Br6WPifJ8nBjjOvojCb5vrEBjqxARaq9%2BU2OoB9LwUqnz8P35PEoIe7NRB14mdvxVPH2xF7mc2u7YXBqZkBDQdFLZ%2BJExZbaoZ2QH%2F9qI8YJS0QoAbFqz%2BId2i3NaJ0Yn9tPvcTW0t54kVetNXBiTeQzF%2F00ihcj6KYMXk4pnnyweGdF2F9bme3Yt2CidqoQxiNYaGUhAbrxPqzljufm0vEzPwccl0VdLetZe1MQJGNUYdEHwjB38j%2BSrWnXFCs1sxeLJBiIQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250815T091816Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIA2FLBG6DOCRINJTLD%2F20250815%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Expires=600&X-Amz-Signature=9eb5c3b75fcd3cb437ab967b12ece2b862f419e1191f2559d6fa87355df89f46',
        iconHTML: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
          <div style="font-size: 16px; font-weight: 600; color: #32363E; background-color: #ffffff; padding: 5px 10px; border-radius: 5px;">
            ${'배연준'} 도우미
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
                  src="${'/images/default-profile.svg'}" 
                  style="width: 100%; height: 100%; object-fit: cover;" 
                  alt="프로필"
                />
              </div>
            </div>
          </div>    
        </div>
        `,
      });

      // ConfigLoad 이벤트 리스너 추가 (Tmap 공식 문서 방식)
      map.on('ConfigLoad', () => {
        addPolyline(map);
      });
    } catch (error) {
      console.error('지도 초기화 오류:', error);
    }
  }, [mapRef, isTmapLoaded, userLocation, mapInstance]);

  // 폴리라인 추가 함수 (Tmap 공식 문서 방식)
  const addPolyline = (map: TMap) => {
    try {
      const routeCoordinates = routeVertices;

      if (routeCoordinates.length < 2) {
        console.warn('경로 좌표가 부족합니다.');
        return;
      }

      // LatLng 객체 배열 생성
      const path = routeCoordinates.map(([lat, lng]) => new Tmapv3.LatLng(lat, lng));

      // Tmap 공식 문서 방식으로 폴리라인 생성
      const polyline = new Tmapv3.Polyline({
        path: path,
        strokeColor: '#39bdea',
        strokeWeight: 6,
        direction: true,
        map: map,
      });

      // 시작점 마커
      const startMarker = new Tmapv3.Marker({
        position: path[0],
        map: map,
        icon: '/icons/marker-home.svg',
      });

      // 끝점 마커
      const endMarker = new Tmapv3.Marker({
        position: path[path.length - 1],
        map: map,
        icon: '/icons/marker-hospital.svg',
      });

      // 경로에 맞게 지도 중심과 줌 조정
      const middlePoint = routeCoordinates[Math.floor(routeCoordinates.length / 2)];
      map.setCenter(new Tmapv3.LatLng(middlePoint[0], middlePoint[1]));
      map.setZoom(7);

      console.log('폴리라인 그리기 완료 (파싱된 좌표):', routeCoordinates);
    } catch (error) {
      console.error('폴리라인 그리기 오류:', error);
    }
  };

  return {
    mapInstance,
    isTmapLoaded,
    userLocation,
    setCurrentLocation,
  };
};
