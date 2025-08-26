import { INITIAL_LATITUDE, INITIAL_LONGITUDE } from '@dashboard/constants';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const getCurrentPosition = (
  options: GeolocationOptions = {}
): Promise<GeolocationPosition> => {
  if (!('geolocation' in navigator)) {
    return Promise.resolve({
      latitude: INITIAL_LATITUDE,
      longitude: INITIAL_LONGITUDE,
      accuracy: 0,
    });
  }

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  };

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({ latitude, longitude, accuracy });
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        resolve({
          latitude: INITIAL_LATITUDE,
          longitude: INITIAL_LONGITUDE,
          accuracy: 0,
        });
      },
      defaultOptions
    );
  });
};

export const watchCurrentPosition = (
  onPositionChange: (position: GeolocationPosition) => void,
  onError?: (error: GeolocationPositionError) => void,
  options: GeolocationOptions = {}
): number | null => {
  if (!('geolocation' in navigator)) {
    onError?.(new Error('Geolocation is not supported') as unknown as GeolocationPositionError);
    return null;
  }

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  };

  return navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      onPositionChange({ latitude, longitude, accuracy });
    },
    (error) => {
      onError?.(error);
    },
    defaultOptions
  );
};

export const clearPositionWatch = (watchId: number): void => {
  if ('geolocation' in navigator) {
    navigator.geolocation.clearWatch(watchId);
  }
};
