import { TopAppBar, BottomCTA } from '@components';
import type { TopAppBarProps } from '../components/TopAppBar';
import type { BottomCTAProps } from '../components/BottomCTA';

interface PageLayoutProps {
  children: React.ReactNode;
  background?: string;
}

interface PageLayoutContentProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({ children, background = 'bg-background-default-white' }: PageLayoutProps) => {
  return (
    <div
      id='page-layout-container'
      className={`shadow-page relative left-1/2 flex min-h-[100dvh] w-full max-w-[500px] min-w-[375px] -translate-x-1/2 flex-col min-[1200px]:left-auto min-[1200px]:ml-[calc(50dvw+7rem)] min-[1200px]:-translate-x-0 ${background}`}>
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

const PageLayoutContent = ({ children, className }: PageLayoutContentProps) => {
  return <div className={`flex-1 ${className}`}>{children}</div>;
};

const Footer = ({ children }: BottomCTAProps) => {
  return <BottomCTA>{children}</BottomCTA>;
};

PageLayout.Header = Header;
PageLayout.Content = PageLayoutContent;
PageLayout.Footer = Footer;

export default PageLayout;
