import { TMapLatLng, TMap, TMapSize, TMapMarker, TMapPolyline, TMapLatLngBounds } from './tmap';

declare global {
  interface Window {
    Tmapv3: {
      Map: new (
        element: HTMLElement | string,
        options?: {
          center?: TMapLatLng;
          scaleBar?: boolean;
          width?: string | number;
          height?: string | number;
          zoom?: number;
          zoomControl?: boolean;
        }
      ) => TMap;
      LatLng: new (lat: number, lon: number) => TMapLatLng;
      Marker: new (options?: {
        map: TMap;
        position: TMapLatLng;
        iconHTML?: string;
        iconSize?: TMapSize;
        label?: string;
        icon?: string;
      }) => TMapMarker;
      Polyline: new (options?: {
        path: TMapLatLng[];
        strokeColor?: string;
        strokeWeight?: number;
        direction?: boolean;
        map: TMap;
        strokeOpacity?: number;
      }) => TMapPolyline;
      LatLngBounds: new () => TMapLatLngBounds;
      Size: new (width: number, height: number) => TMapSize;
    };
  }
}

export {};
