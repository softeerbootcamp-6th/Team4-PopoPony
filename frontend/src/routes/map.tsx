import { INITIAL_LATITUDE, INITIAL_LONGITUDE } from '@dashboard/constants';
import { useMap } from '@hooks';
import { IcArrowLeft } from '@icons';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import z from 'zod';

const mapSearchSchema = z.object({
  lat: z.number().default(INITIAL_LATITUDE),
  lng: z.number().default(INITIAL_LONGITUDE),
});

export const Route = createFileRoute('/map')({
  validateSearch: mapSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { lat, lng } = Route.useSearch();
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapInstance, addMarker, setCenter } = useMap(mapRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    if (mapInstance) {
      addMarker(lat, lng);
      setCenter(lat, lng);
    }
  }, [mapInstance, lat, lng]);

  return (
    <div className='bg-neutral-40 absolute inset-0 h-[100dvh] w-[100dvw]'>
      <div className='flex h-full flex-col'>
        <div ref={mapRef} className='h-full w-full'></div>
      </div>
      <button
        type='button'
        className='shadow-button flex-center bg-background-default-mint absolute top-[1.6rem] left-[1.6rem] h-[4.8rem] w-[4.8rem] cursor-pointer rounded-full p-[0.8rem]'
        onClick={() => {
          router.history.back();
        }}>
        <IcArrowLeft className='[&_path]:fill-white [&_path]:stroke-white' />
      </button>
    </div>
  );
}
