import { BottomCTA, Button } from '@components';
import { useRouter } from '@tanstack/react-router';

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout = ({ children }: FormLayoutProps) => {
  return <div className='flex h-full w-full flex-col'>{children}</div>;
};

const TitleWrapper = ({ children }: FormLayoutProps) => {
  return <div className='flex flex-col gap-[0.8rem]'>{children}</div>;
};

const Title = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <h2 className={`headline-24-bold text-text-neutral-primary break-keep ${className}`}>
      {children}
    </h2>
  );
};
const SubTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <h3 className={`body1-16-medium text-text-neutral-secondary pt-[0.8rem] ${className}`}>
      {children}
    </h3>
  );
};

const Content = ({ children }: FormLayoutProps) => {
  return (
    <div className='flex flex-1 flex-col gap-[3.2rem] overflow-y-auto p-[2rem]'>{children}</div>
  );
};

const Footer = ({ children }: FormLayoutProps) => {
  return (
    <div className='flex-shrink-0'>
      <BottomCTA>{children}</BottomCTA>
    </div>
  );
};

const FooterPrevNext = ({
  handleClickNext,
  disabled,
}: {
  handleClickNext?: () => void;
  disabled: boolean;
}) => {
  const router = useRouter();

  const handleClickPrev = () => {
    router.history.back();
  };

  if (!handleClickNext) {
    return null;
  }

  return (
    <div className='flex w-full flex-shrink-0 gap-[0.8rem]'>
      <div className='w-[10rem]'>
        <Button variant='secondary' onClick={handleClickPrev}>
          이전
        </Button>
      </div>
      <Button className='flex-1' onClick={handleClickNext} disabled={disabled}>
        다음
      </Button>
    </div>
  );
};

const FooterButtonWrapper = ({ children }: FormLayoutProps) => {
  return <div className='flex w-full flex-shrink-0 gap-[0.8rem]'>{children}</div>;
};

FormLayout.TitleWrapper = TitleWrapper;
FormLayout.Title = Title;
FormLayout.SubTitle = SubTitle;
FormLayout.Content = Content;
FormLayout.Footer = Footer;
FormLayout.FooterPrevNext = FooterPrevNext;
FormLayout.FooterButtonWrapper = FooterButtonWrapper;

export default FormLayout;
