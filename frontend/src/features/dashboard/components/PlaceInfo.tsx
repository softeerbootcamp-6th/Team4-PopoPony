import { ShowMapButton } from '@shared/ui';
import { IcMarker1, IcMarker2, IcMarker3 } from '@icons';
import { useMemo } from 'react';

interface PlaceInfoProps {
  sequence: number;
  placeName: string;
  address: string;
  detailAddress: string;
  pos: { lat: number; lon: number };
}

const PlaceInfo = ({ sequence, placeName, address, detailAddress, pos }: PlaceInfoProps) => {
  const marker = useMemo(() => {
    switch (sequence) {
      case 1:
        return <IcMarker1 />;
      case 2:
        return <IcMarker2 />;
      case 3:
        return <IcMarker3 />;
    }
  }, [sequence]);

  return (
    <div className='flex gap-[1.2rem]'>
      {marker}
      <div className='flex flex-col gap-[0.4rem]'>
        <p className='subtitle-18-medium text-text-neutral-primary'>{placeName}</p>
        <ShowMapButton
          roadAddress={address}
          businessAddress={detailAddress}
          pos={{ lat: pos.lat, lng: pos.lon }}
        />
      </div>
    </div>
  );
};

export default PlaceInfo;
