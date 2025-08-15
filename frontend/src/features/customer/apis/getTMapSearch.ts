// TMap POI 검색 API 함수

interface TMapSearchParams {
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

interface TMapPOI {
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

interface TMapSearchResponse {
  searchPoiInfo: {
    totalCount: string;
    count: string;
    page: string;
    pois?: {
      poi: TMapPOI[];
    };
  };
}

const getTMapSearch = async (params: TMapSearchParams): Promise<TMapSearchResponse> => {
  const searchParams = new URLSearchParams({
    version: (params.version || 1).toString(),
    format: 'json',
    searchKeyword: params.searchKeyword, // URLSearchParams가 자동으로 인코딩하므로 encodeURIComponent 제거
    page: (params.page || 1).toString(),
    count: (params.count || 20).toString(),
    resCoordType: params.resCoordType || 'WGS84GEO',
    searchType: params.searchType || 'all',
    searchtypCd: params.searchtypCd || 'A',
    reqCoordType: params.reqCoordType || 'WGS84GEO',
    multiPoint: params.multiPoint || 'N',
    poiGroupYn: params.poiGroupYn || 'N',
    buildingNameYn: params.buildingNameYn || 'N',
    appKey: import.meta.env.VITE_TMAP_API_KEY || '',
  });

  // 선택적 파라미터 추가
  if (params.areaLLCode) searchParams.append('areaLLCode', params.areaLLCode);
  if (params.areaLMCode) searchParams.append('areaLMCode', params.areaLMCode);
  if (params.radius) searchParams.append('radius', params.radius);
  if (params.centerLon !== undefined) searchParams.append('centerLon', params.centerLon.toString());
  if (params.centerLat !== undefined) searchParams.append('centerLat', params.centerLat.toString());
  if (params.evPublicType) searchParams.append('evPublicType', params.evPublicType);
  if (params.evOemType) searchParams.append('evOemType', params.evOemType);
  if (params.removeFireplugYn) searchParams.append('removeFireplugYn', params.removeFireplugYn);

  const response = await fetch(`https://apis.openapi.sk.com/tmap/pois?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMap API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export default getTMapSearch;
export type { TMapSearchParams, TMapSearchResponse, TMapPOI };
