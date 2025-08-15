import { useState, useEffect, useRef, useCallback } from 'react';
import { FormLayout } from '@layouts';
import { useFormContext } from 'react-hook-form';
import { useLocation } from '@tanstack/react-router';
import type { LocationDetail } from '@customer/types';
import SearchInput from '../search/searchInput';

import useTMapSearch from '@customer/apis/getTMapSearch';
import type { TMapPOI } from '@customer/apis/getTMapSearch';
import { useDebounce } from '@hooks';
import { Spinner } from '@components';

interface SearchRouteProps {
  handleSelectRoute: () => void;
}

// place 파라미터에 따른 텍스트 매핑
const getPlaceText = (place?: string): React.ReactNode => {
  switch (place) {
    case 'meeting':
      return (
        <span>
          <strong className='text-text-mint-primary'>만남 장소</strong>를 선택해주세요
        </span>
      );
    case 'hospital':
      return (
        <span>
          <strong className='text-text-mint-primary'>병원</strong>을 선택해주세요
        </span>
      );
    case 'return':
      return (
        <span>
          <strong className='text-text-mint-primary'>복귀 장소</strong>를 선택해주세요
        </span>
      );
    default:
      return (
        <span>
          <strong className='text-text-mint-primary'>만남 장소</strong>를 선택해주세요
        </span>
      );
  }
};

const SearchRoute = ({ handleSelectRoute }: SearchRouteProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const placeParam = searchParams.get('place') ?? '';

  const place = getPlaceText(placeParam);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300); // 500ms 디바운싱

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTMapSearch(debouncedSearchValue);

  // 모든 페이지의 POI 데이터를 합쳐서 하나의 배열로 만듦
  const allSearchResults =
    searchData?.pages.flatMap((page) => page.searchPoiInfo.pois?.poi || []) || [];

  const { setValue } = useFormContext();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // place에 따른 form field 이름 결정
  const getFormFieldName = () => {
    switch (placeParam) {
      case 'meeting':
        return 'meetingLocationDetail';
      case 'hospital':
        return 'destinationDetail';
      case 'return':
        return 'returnLocationDetail';
      default:
        return 'meetingLocationDetail';
    }
  };

  // 무한 스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const convertToLocationDetail = useCallback((poi: TMapPOI): LocationDetail => {
    return {
      placeName: poi.name,
      upperAddrName: poi.upperAddrName,
      middleAddrName: poi.middleAddrName,
      lowerAddrName: poi.lowerAddrName,
      firstAddrNo: poi.firstNo,
      secondAddrNo: poi.secondNo,
      roadName: poi.roadName,
      firstBuildingNo: poi.firstBuildNo,
      secondBuildingNo: poi.secondBuildNo,
      detailAddress: poi.detailAddrname || '',
      longitude: parseFloat(poi.frontLon),
      latitude: parseFloat(poi.frontLat),
    };
  }, []);

  // 검색 결과 선택 핸들러
  const handleSelectItem = (poi: TMapPOI) => {
    const selectedItem = convertToLocationDetail(poi);
    const formFieldName = getFormFieldName();

    // detailAddress를 제외한 데이터를 form에 저장
    const locationData = {
      placeName: selectedItem.placeName,
      upperAddrName: selectedItem.upperAddrName,
      middleAddrName: selectedItem.middleAddrName,
      lowerAddrName: selectedItem.lowerAddrName,
      firstAddrNo: selectedItem.firstAddrNo,
      secondAddrNo: selectedItem.secondAddrNo,
      roadName: selectedItem.roadName,
      firstBuildingNo: selectedItem.firstBuildingNo,
      secondBuildingNo: selectedItem.secondBuildingNo,
      longitude: selectedItem.longitude,
      latitude: selectedItem.latitude,
    };

    setValue(formFieldName, locationData);

    // 검색 결과 초기화 및 라우트 변경
    // setSearchResult([]);
    // setSearchValue('');
    handleSelectRoute();
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>{place}</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='flex flex-col gap-[2rem]'>
          <SearchInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder='검색어를 입력해주세요'
          />

          <Spinner
            isLoading={isLoading && debouncedSearchValue.length > 0}
            className='mt-[3.6rem]'
            size='3.2rem'
          />

          {isError && debouncedSearchValue && (
            <div className='body2-14-medium rounded-lg p-[1.2rem] text-center'>
              검색 중 오류가 발생했습니다.
            </div>
          )}

          {allSearchResults.length > 0 && (
            <div className='flex max-h-[40rem] flex-col overflow-y-auto'>
              {allSearchResults.map((result, index) => (
                <button
                  key={`${result.id}-${index}`}
                  className='bg-neutral-0 border-stroke-neutral-light hover:bg-neutral-10 flex flex-col gap-[0.2rem] border-b-2 px-[2rem] py-[1.2rem] text-left transition-colors'
                  onClick={() => handleSelectItem(result)}
                  type='button'>
                  <h4 className='body1-16-medium text-text-neutral-primary'>{result.name}</h4>
                  <h5 className='body2-14-medium text-text-neutral-secondary'>
                    {result.upperAddrName} {result.middleAddrName} {result.lowerAddrName}{' '}
                    {result.roadName} {result.firstBuildNo}
                    {result.secondBuildNo ? `-${result.secondBuildNo}` : ''}
                  </h5>
                </button>
              ))}

              <div
                ref={loadMoreRef}
                className='mt-[1.6rem] flex h-[2rem] items-center justify-center'>
                <Spinner isLoading={isFetchingNextPage} />
              </div>
            </div>
          )}

          {debouncedSearchValue.trim() &&
            !isLoading &&
            !isError &&
            allSearchResults.length === 0 && (
              <div className='body2-14-medium rounded-lg p-[1.2rem] text-center'>
                검색 결과가 없습니다.
              </div>
            )}
        </div>
      </FormLayout.Content>
    </FormLayout>
  );
};

export default SearchRoute;
