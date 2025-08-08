import { TopAppBar, BottomCTA } from '@components';
import type { TopAppBarProps } from '../components/TopAppBar';
import type { BottomCTAProps } from '../components/BottomCTA';

interface PageLayoutProps {
  children: React.ReactNode;
  background?: string;
}

interface PageLayoutContentProps {
  children: React.ReactNode;
}

const PageLayout = ({ children, background = 'bg-background-default-white' }: PageLayoutProps) => {
  return (
    <div
      id='page-layout-container'
      className={`shadow-page relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[500px] min-w-[375px] flex-col ${background}`}>
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

const PageLayoutContent = ({ children }: PageLayoutContentProps) => {
  return <div className='flex-1 overflow-y-auto'>{children}</div>;
};

const Footer = ({ children }: BottomCTAProps) => {
  return <BottomCTA>{children}</BottomCTA>;
};

PageLayout.Header = Header;
PageLayout.Content = PageLayoutContent;
PageLayout.Footer = Footer;

export default PageLayout;
