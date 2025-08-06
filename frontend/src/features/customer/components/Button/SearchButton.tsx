import type { ButtonHTMLAttributes } from 'react';
import { IcSearch } from '@icons';

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
          className={`font-pretendard relative shrink-0 text-left leading-[0] tracking-[-0.032rem] text-nowrap not-italic ${
            text ? 'text-neutral-90' : 'text-neutral-50'
          }`}>
          <p className='adjustLetterSpacing block text-[1.6rem] leading-[1.5] font-medium whitespace-pre'>
            {displayText}
          </p>
        </div>
        {!text && (
          <div className='relative size-[2.4rem] shrink-0'>
            <div className='absolute top-[12.5%] right-[9.19%] bottom-[9.17%] left-[12.5%]'>
              <IcSearch className='[&_path]:fill-neutral-40 size-full' />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default SearchButton;
