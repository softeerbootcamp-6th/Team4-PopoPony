export type MarkerType = 'marker1' | 'marker2' | 'marker3' | 'home' | 'hospital' | 'me';

// 경로 세그먼트 인터페이스
export interface RouteSegment {
  startMarkerType: MarkerType;
  endMarkerType: MarkerType;
  pathCoordinates: [number, number][];
}
