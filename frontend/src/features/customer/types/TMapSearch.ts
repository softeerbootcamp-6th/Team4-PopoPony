export interface TMapSearchParams {
  searchKeyword: string;
  version?: number;
  page?: number;
  count?: number;
  areaLLCode?: string;
  areaLMCode?: string;
  resCoordType?: 'WGS84GEO' | 'EPSG3857' | 'KATECH';
  searchType?: 'all' | 'name' | 'telno';
  searchtypCd?: 'A' | 'R';
  radius?: string;
  reqCoordType?: 'WGS84GEO' | 'EPSG3857' | 'KATECH';
  centerLon?: number;
  centerLat?: number;
  multiPoint?: 'Y' | 'N';
  poiGroupYn?: 'Y' | 'N';
  evPublicType?: string;
  evOemType?: string;
  removeFireplugYn?: string;
  buildingNameYn?: 'Y' | 'N';
}

export interface TMapPOI {
  id: string;
  name: string;
  telNo: string;
  frontLat: string;
  frontLon: string;
  noorLat: string;
  noorLon: string;
  upperAddrName: string;
  middleAddrName: string;
  lowerAddrName: string;
  detailAddrname: string;
  mlClass: string;
  firstNo: string;
  secondNo: string;
  roadName: string;
  firstBuildNo: string;
  secondBuildNo: string;
  radius: string;
  bizName: string;
  upperBizName: string;
  middleBizName: string;
  lowerBizName: string;
  detailBizName: string;
  rpFlag: string;
  groupSubLists?: unknown[];
}

export interface TMapSearchResponse {
  searchPoiInfo: {
    totalCount: string;
    count: string;
    page: string;
    pois?: {
      poi: TMapPOI[];
    };
  };
}
