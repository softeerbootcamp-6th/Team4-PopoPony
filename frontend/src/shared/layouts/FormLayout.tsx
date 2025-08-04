import { BottomCTA } from '@components';

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout = ({ children }: FormLayoutProps) => {
  return <div className='bg-background-default-white flex h-full w-full flex-col'>{children}</div>;
};

const Title = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={`headline-24-bold text-text-neutral-primary break-keep ${className}`}>
      <h2>{children}</h2>
    </div>
  );
};
const SubTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={`body1-16-medium text-text-neutral-secondary pt-[0.8rem] ${className}`}>
      {children}
    </div>
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

FormLayout.Title = Title;
FormLayout.SubTitle = SubTitle;
FormLayout.Content = Content;
FormLayout.Footer = Footer;

export default FormLayout;
