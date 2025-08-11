import { useState } from 'react';
import { FormLayout } from '@layouts';
import { useFormContext } from 'react-hook-form';
import { useLocation } from '@tanstack/react-router';
import type { LocationDetail } from '@customer/types';
import SearchInput from '../search/searchInput';
import { searchResultData } from '@customer/mocks/searchRoute';

interface SearchRouteProps {
  handleSelectRoute: () => void;
}

// place 파라미터에 따른 텍스트 매핑
const getPlaceText = (place?: string): '만남 장소를' | '병원을' | '복귀 장소를' => {
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

const SearchRoute = ({ handleSelectRoute }: SearchRouteProps) => {
  // URL에서 query parameter 파싱
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const placeParam = searchParams.get('place') ?? '';

  const place = getPlaceText(placeParam);
  const [searchValue, setSearchValue] = useState('');
  // const [searchResult, setSearchResult] = useState<LocationDetail[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useFormContext();

  // const fetchSearchResult = async () => {
  //   if (!searchValue.trim()) {
  //     setSearchResult([]);
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const result = await searchRoute(searchValue);
  //     setSearchResult(result);
  //   } catch (error) {
  //     console.error('검색 중 오류 발생:', error);
  //     setSearchResult([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchSearchResult();
  // }, [searchValue]);

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
    // setSearchResult([]);
    setSearchValue('');
    handleSelectRoute();
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>{place} 선택해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='flex flex-col gap-[2rem]'>
          <SearchInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder='검색어를 입력해주세요'
          />

          {/* 로딩 상태 */}
          {/* {isLoading && (
            <div className='mt-[1.6rem] p-[1.2rem] text-center text-gray-500'>검색 중...</div>
          )} */}

          {searchResultData.length > 0 && (
            <div className='flex flex-col'>
              {searchResultData.map((result, index) => (
                <button
                  key={`${result.placeName}-${index}`}
                  className='bg-neutral-0 border-stroke-neutral-light hover:bg-neutral-10 flex flex-col gap-[0.2rem] border-b-2 px-[2rem] py-[1.2rem] text-left transition-colors'
                  onClick={() => handleSelectItem({ ...result, detailAddress: '' })}
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
          {searchValue.trim() && searchResultData.length === 0 && (
            <div className='text-text-neutral-assistive border-stroke-neutral-light mt-[1.6rem] rounded-lg border p-[1.2rem] text-center'>
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </FormLayout.Content>
    </FormLayout>
  );
};

export default SearchRoute;
