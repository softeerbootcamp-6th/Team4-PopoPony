import type { TMapSearchParams, TMapSearchResponse } from '@customer/types';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchTMapSearch = async (params: TMapSearchParams): Promise<TMapSearchResponse> => {
  const searchParams = new URLSearchParams({
    version: (params.version || 1).toString(),
    format: 'json',
    searchKeyword: params.searchKeyword,
    page: (params.page || 1).toString(),
    count: (params.count || 10).toString(),
    resCoordType: params.resCoordType || 'WGS84GEO',
    searchType: params.searchType || 'all',
    searchtypCd: params.searchtypCd || 'A',
    reqCoordType: params.reqCoordType || 'WGS84GEO',
    multiPoint: params.multiPoint || 'N',
    poiGroupYn: params.poiGroupYn || 'N',
    buildingNameYn: params.buildingNameYn || 'N',
    appKey: import.meta.env.VITE_TMAP_API_KEY || '',
  });

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

  if (response.status === 204) {
    return {
      searchPoiInfo: {
        totalCount: '0',
        count: '0',
        page: '1',
        pois: undefined,
      },
    };
  }

  if (!response.ok) {
    throw new Error(`TMap API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const getTMapSearch = (searchKeyword: string, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['tmap-search', searchKeyword],
    queryFn: ({ pageParam = 1 }) =>
      fetchTMapSearch({
        searchKeyword,
        page: pageParam,
        count: 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = parseInt(lastPage.searchPoiInfo.totalCount);
      const currentPage = allPages.length;

      if (currentPage * 10 < totalCount) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && searchKeyword.trim().length > 0,
    staleTime: 5 * 60 * 1000,

    retry: (failureCount, error) => {
      if (error.message.includes('204') || error.message.includes('4')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};

export default getTMapSearch;
