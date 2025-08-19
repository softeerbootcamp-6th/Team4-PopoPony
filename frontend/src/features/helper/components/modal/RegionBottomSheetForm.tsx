import { BottomSheet } from '@components';
import { REGION_OPTIONS } from '@helper/types';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface RegionBottomSheetFormProps {
  children: React.ReactNode;
  name: string;
}

const RegionBottomSheetForm = ({ children, name }: RegionBottomSheetFormProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { register } = useFormContext();

  return (
    <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
      <BottomSheet.Trigger asChild>{children}</BottomSheet.Trigger>
      <BottomSheet.Content>
        <BottomSheet.Header>
          <BottomSheet.Title>지역을 선택해주세요</BottomSheet.Title>
        </BottomSheet.Header>
        <div className='grid grid-cols-3 gap-x-[0.8rem] gap-y-[1.2rem] p-[2rem]'>
          {REGION_OPTIONS.map((option, index) => {
            return (
              <div key={index} className='w-full'>
                <input
                  type='radio'
                  id={index.toString()}
                  value={option.value}
                  className='peer hidden'
                  onClick={() => {
                    setIsBottomSheetOpen(false);
                  }}
                  {...register(name)}
                />
                <label
                  htmlFor={index.toString()}
                  className='border-neutral-20 peer-checked:border-mint-60 peer-checked:bg-mint-5 peer-checked:text-mint-70 flex-center body1-16-medium text-neutral-90 h-[4.8rem] w-full cursor-pointer rounded-[0.6rem] border'>
                  {option.value.slice(0, 2)}
                </label>
              </div>
            );
          })}
        </div>
      </BottomSheet.Content>
    </BottomSheet>
  );
};

export default RegionBottomSheetForm;
