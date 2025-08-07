import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/shared/libs/utils';

// Main BottomSheet Component
interface BottomSheetProps extends React.ComponentProps<typeof SheetPrimitive.Root> {
  children: React.ReactNode;
}

const BottomSheet = ({ children, ...props }: BottomSheetProps) => {
  const containerId = 'page-layout-container';
  return (
    <SheetPrimitive.Root data-slot='bottom-sheet' {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === BottomSheetContent
          ? React.cloneElement(child as React.ReactElement<BottomSheetContentProps>, {
              containerId,
            })
          : child
      )}
    </SheetPrimitive.Root>
  );
};

const BottomSheetTrigger = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot='bottom-sheet-trigger' {...props} />;
};

interface BottomSheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  className?: string;
  children: React.ReactNode;
  containerId?: string;
}

const BottomSheetContent = ({
  className,
  children,
  containerId = 'page-layout-container',
  ...props
}: BottomSheetContentProps) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  // container element를 찾아서 상태로 관리
  React.useEffect(() => {
    const containerElement = document.getElementById(containerId);
    setContainer(containerElement);

    // container에 relative position 설정 (absolute positioning의 기준점 설정)
    if (containerElement) {
      const originalPosition = containerElement.style.position;
      if (!originalPosition || originalPosition === 'static') {
        containerElement.style.position = 'relative';
      }
    }
  }, [containerId]);

  // container가 없으면 렌더링하지 않음
  if (!container) {
    return null;
  }

  return (
    <SheetPrimitive.Portal container={container}>
      <SheetPrimitive.Overlay
        data-slot='bottom-sheet-overlay'
        className={cn('bg-black-opacity-60 absolute inset-0 z-50', className)}
      />
      <SheetPrimitive.Content
        data-slot='bottom-sheet-content'
        className={cn(
          'shadow-bottom-sheet bg-background-default-white absolute inset-x-0 bottom-0 z-50 h-auto rounded-t-[1.2rem]',
          className
        )}
        {...props}>
        {children}
        <SheetPrimitive.Close className='absolute top-[1.6rem] right-[1.6rem] rounded-[0.8rem] p-[0.8rem] opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-[var(--color-background-default-mint)] focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'>
          <XIcon className='text-text-neutral-primary h-[2rem] w-[2rem]' />
          <span className='sr-only'>닫기</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
};

// Header Component
interface BottomSheetHeaderProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

const BottomSheetHeader = ({ className, children, ...props }: BottomSheetHeaderProps) => {
  return (
    <div
      data-slot='bottom-sheet-header'
      className={cn('flex flex-col gap-[1.5rem] p-[2rem] pb-[1.2rem]', className)}
      {...props}>
      {children}
    </div>
  );
};

// Footer Component
interface BottomSheetFooterProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

const BottomSheetFooter = ({ className, children, ...props }: BottomSheetFooterProps) => {
  return (
    <div
      data-slot='bottom-sheet-footer'
      className={cn('mt-auto flex flex-col gap-[1.2rem] p-[2rem] pt-[1.2rem]', className)}
      {...props}>
      {children}
    </div>
  );
};

// Title Component
interface BottomSheetTitleProps extends React.ComponentProps<typeof SheetPrimitive.Title> {
  children: React.ReactNode;
}

const BottomSheetTitle = ({ className, children, ...props }: BottomSheetTitleProps) => {
  return (
    <SheetPrimitive.Title
      data-slot='bottom-sheet-title'
      className={cn('title-20-bold text-text-neutral-primary', className)}
      {...props}>
      {children}
    </SheetPrimitive.Title>
  );
};

// Description Component
interface BottomSheetDescriptionProps
  extends React.ComponentProps<typeof SheetPrimitive.Description> {
  children: React.ReactNode;
}

const BottomSheetDescription = ({ className, children, ...props }: BottomSheetDescriptionProps) => {
  return (
    <SheetPrimitive.Description
      data-slot='bottom-sheet-description'
      className={cn('body1-16-medium text-text-neutral-secondary', className)}
      {...props}>
      {children}
    </SheetPrimitive.Description>
  );
};

// Close Component
const BottomSheetClose = ({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot='bottom-sheet-close' {...props} />;
};

// Compound Component Export
BottomSheet.Trigger = BottomSheetTrigger;
BottomSheet.Content = BottomSheetContent;
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Footer = BottomSheetFooter;
BottomSheet.Title = BottomSheetTitle;
BottomSheet.Description = BottomSheetDescription;
BottomSheet.Close = BottomSheetClose;

export default BottomSheet;
