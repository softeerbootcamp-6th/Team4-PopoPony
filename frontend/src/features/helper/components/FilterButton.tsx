import { IcChevronDown, IcCloseS } from '@icons';

interface FilterButtonProps {
  label: string;
  selected?: string | undefined;
  onClick?: () => void;
  onClickReset?: () => void;
}

const FilterButton = ({ label, selected, onClick, onClickReset }: FilterButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex-center body1-16-bold bg-neutral-10 w-fit gap-[0.4rem] rounded-full px-[1.2rem] py-[0.4rem]'>
      {selected ? (
        <>
          <span className='text-text-mint-primary'>{selected}</span>
          <IcCloseS
            onClick={(e) => {
              e.stopPropagation();
              onClickReset?.();
            }}
          />
        </>
      ) : (
        <>
          <span className='text-text-neutral-primary'>{label}</span>
          <IcChevronDown />
        </>
      )}
    </button>
  );
};

export default FilterButton;
