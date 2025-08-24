import { IcSearch } from '@icons';

import type { ButtonHTMLAttributes } from 'react';

interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const SearchButton = ({ text, onClick, ...props }: SearchButtonProps) => {
  const placeholder = '지번, 도로명, 건물명으로 검색';
  const displayText = text ? text : placeholder;

  return (
    <button
      onClick={onClick}
      className={`border-stroke-neutral-dark bg-neutral-0 relative flex h-[5.1rem] w-full flex-col content-stretch items-center justify-center gap-[0.8rem] rounded-[0.8rem] border px-[1.6rem] transition-colors`}
      {...props}>
      <div className='relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-between p-0'>
        <div
          className={`relative shrink-0 text-left text-nowrap ${
            text ? 'text-neutral-90' : 'text-neutral-50'
          }`}>
          <p className='body1-16-medium'>{displayText}</p>
        </div>
        {!text && <IcSearch className='[&_path]:fill-neutral-40 h-[2.4rem] w-[2.4rem]' />}
      </div>
    </button>
  );
};

export default SearchButton;
