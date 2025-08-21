export type MarkerType = 'marker1' | 'marker2' | 'marker3' | 'home' | 'hospital' | 'me';

export type Position = { lat: number; lon: number };

// 경로 세그먼트 인터페이스
export interface RouteSegment {
  startMarkerType: MarkerType;
  endMarkerType: MarkerType;
  pathCoordinates: Position[];
}
