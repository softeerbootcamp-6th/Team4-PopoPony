import { TopAppBar, ButtonCTA } from '@components';
import type { TopAppBarProps } from '../components/TopAppBar';
import type { ButtonCTAProps } from '../components/ButtonCTA';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className='bg-background-default-white relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[500px] min-w-[375px] flex-col'>
      {children}
    </div>
  );
};

const Header = ({ title, showBack, showClose, background, onClose, className }: TopAppBarProps) => {
  return (
    <TopAppBar
      title={title}
      showBack={showBack}
      showClose={showClose}
      background={background}
      onClose={onClose}
      className={className}
    />
  );
};

const PageLayoutContent = ({ children }: PageLayoutProps) => {
  return <div className='flex-1 overflow-y-auto'>{children}</div>;
};

const Footer = ({ variant, text, className, ...props }: ButtonCTAProps) => {
  return <ButtonCTA variant={variant} text={text} className={className} {...props} />;
};

PageLayout.Header = Header;
PageLayout.Content = PageLayoutContent;
PageLayout.Footer = Footer;

export default PageLayout;
