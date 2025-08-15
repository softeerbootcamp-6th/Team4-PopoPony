import { useMap } from '@hooks';
import { IcCurrentLocation } from '@icons';
import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';

export const Route = createFileRoute('/map')({
  component: RouteComponent,
});

function RouteComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isTmapLoaded, setCurrentLocation } = useMap(
    mapRef as React.RefObject<HTMLDivElement>
  );

  // Tmap이 로드되지 않았으면 로딩 표시
  if (!isTmapLoaded) {
    return (
      <div className='bg-background-default-white absolute inset-0 flex h-[100dvh] w-[100dvw] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
          <p className='text-gray-600'>지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-neutral-40 absolute inset-0 h-[100dvh] w-[100dvw]'>
      <div ref={mapRef} className='h-full w-full'></div>
      <div
        className='bg-neutral-0 shadow-button absolute bottom-[1.6rem] left-[1.6rem] cursor-pointer rounded-full p-[0.8rem]'
        onClick={setCurrentLocation}>
        <IcCurrentLocation />
      </div>
    </div>
  );
}
