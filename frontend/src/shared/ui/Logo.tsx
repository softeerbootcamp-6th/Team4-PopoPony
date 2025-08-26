import { Link } from '@tanstack/react-router';

import { cn } from '@shared/lib';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      to='/'
      className={cn(
        'text-background-default-mint w-fit text-[3.6rem] leading-[100%] font-bold',
        className
      )}>
      토닥
    </Link>
  );
};

export default Logo;
