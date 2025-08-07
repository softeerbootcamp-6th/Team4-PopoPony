import { useState, useEffect } from 'react';
import { FormLayout } from '@layouts';
import { searchRoute } from '@customer/apis';
import { useFormContext } from 'react-hook-form';
import { useLocation } from '@tanstack/react-router';
import type { LocationDetail } from '@customer/types';
import SearchInput from '../search/searchInput';

type Props = {
  handleSelectRoute: () => void;
};

const SearchRoute = ({ handleSelectRoute }: Props) => {
  // URL에서 query parameter 파싱
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const placeParam = searchParams.get('place');

  // place 파라미터에 따른 텍스트 매핑
  const getPlaceText = (place?: string | null): '만남 장소를' | '병원을' | '복귀 장소를' => {
    switch (place) {
      case 'meeting':
        return '만남 장소를';
      case 'hospital':
        return '병원을';
      case 'return':
        return '복귀 장소를';
      default:
        return '만남 장소를';
    }
  };

  const place = getPlaceText(placeParam);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState<LocationDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setValue, getValues } = useFormContext();

  const fetchSearchResult = async () => {
    if (!searchValue.trim()) {
      setSearchResult([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchRoute(searchValue);
      setSearchResult(result);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setSearchResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResult();
  }, [searchValue]);

  // place에 따른 form field 이름 결정
  const getFormFieldName = () => {
    switch (place) {
      case '만남 장소를':
        return 'meetingLocationDetail';
      case '병원을':
        return 'destinationDetail';
      case '복귀 장소를':
        return 'returnLocationDetail';
      default:
        return 'meetingLocationDetail';
    }
  };

  // 검색 결과 선택 핸들러
  const handleSelectItem = (selectedItem: LocationDetail) => {
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
    setSearchResult([]);
    setSearchValue('');
    handleSelectRoute();
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>{place} 선택해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>

        <SearchInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder='검색어를 입력해주세요'
        />

        {/* 로딩 상태 */}
        {isLoading && <div className='mt-4 p-2 text-center text-gray-500'>검색 중...</div>}

        {/* 검색 결과 목록 */}
        {searchResult.length > 0 && (
          <div className='mt-4 flex flex-col gap-[0.4rem]'>
            {searchResult.map((result, index) => (
              <button
                key={`${result.placeName}-${index}`}
                className='flex flex-col gap-[0.2rem] rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50'
                onClick={() => handleSelectItem(result)}
                type='button'>
                <h4 className='body1-16-medium text-text-neutral-primary'>{result.placeName}</h4>
                <h5 className='body2-14-medium text-text-neutral-secondary'>
                  {result.upperAddrName} {result.middleAddrName} {result.lowerAddrName}{' '}
                  {result.roadName} {result.firstBuildingNo}
                  {result.secondBuildingNo ? `-${result.secondBuildingNo}` : ''}
                </h5>
              </button>
            ))}
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {searchValue.trim() && !isLoading && searchResult.length === 0 && (
          <div className='mt-4 rounded-lg border border-gray-200 p-4 text-center text-gray-500'>
            검색 결과가 없습니다.
          </div>
        )}
      </FormLayout.Content>
    </FormLayout>
  );
};

export default SearchRoute;
