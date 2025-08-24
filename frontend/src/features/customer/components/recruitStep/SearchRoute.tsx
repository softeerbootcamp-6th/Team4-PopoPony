import { getRouteApi } from '@tanstack/react-router';

import { useEffect, useRef, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { useDebounce } from '@shared/hooks';
import { Spinner } from '@shared/ui';
import { FormLayout } from '@shared/ui/layout';

import useTMapSearch from '@customer/apis/getTMapSearch';
import type { PlaceType, SearchLocationDetail, TMapPOI } from '@customer/types';

import SearchInput from '../search/searchInput';

interface SearchRouteProps {
  handleSelectRoute: () => void;
}

const getPlaceText = (place: PlaceType): React.ReactNode => {
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

const getFormFieldName = (placeParam: PlaceType) => {
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

const convertToLocationDetail = (poi: TMapPOI): SearchLocationDetail => {
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
    longitude: parseFloat(poi.frontLon),
    latitude: parseFloat(poi.frontLat),
  };
};

const route = getRouteApi('/customer/recruit/$step');

const SearchRoute = ({ handleSelectRoute }: SearchRouteProps) => {
  const { place: placeParam } = route.useSearch();
  const placeTitle = getPlaceText(placeParam);
  const formFieldName = getFormFieldName(placeParam);

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTMapSearch(debouncedSearchValue);

  const allSearchResults =
    searchData?.pages.flatMap((page) => page.searchPoiInfo.pois?.poi || []) || [];

  const { setValue } = useFormContext();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleSelectItem = (poi: TMapPOI) => {
    const selectedItem = convertToLocationDetail(poi);

    setValue(formFieldName, selectedItem);
    handleSelectRoute();
  };

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

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>{placeTitle}</FormLayout.Title>
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
            <div className='flex h-full flex-col overflow-y-auto'>
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
