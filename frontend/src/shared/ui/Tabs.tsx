import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@shared/lib';

const Tabs = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
};

const TabsList = ({
  className,
  withHeader = false,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { withHeader?: boolean }) => {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      className={cn(
        'bg-background-default-white text-neutral-assistive flex-center sticky z-20 rounded-lg',
        withHeader ? 'top-[5.6rem]' : 'top-0',
        className
      )}
      {...props}
    />
  );
};

const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        'group flex-center body1-16-bold border-b-stroke-neutral-light text-text-neutral-assistive relative h-[5rem] flex-1 gap-[0.4rem] border-b-2 px-2 py-1 whitespace-nowrap',
        'data-[state=active]:text-text-neutral-primary',
        'data-[state=active]:after:bg-neutral-90 data-[state=active]:after:absolute data-[state=active]:after:bottom-[-2px] data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[5.6rem] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:rounded-full data-[state=active]:after:content-[""]',
        className
      )}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('bg-background-default-white flex-1 outline-none', className)}
      {...props}
    />
  );
};

const TabsContentSection = ({
  children,
  gap = 'gap-[1.6rem]',
}: {
  children: React.ReactNode;
  gap?: string;
}) => {
  return <div className={`flex flex-col p-[2rem] ${gap}`}>{children}</div>;
};

const TabsDivider = () => {
  return <div className='bg-stroke-neutral-light h-[6px] w-full' />;
};

Tabs.TabsList = TabsList;
Tabs.TabsTrigger = TabsTrigger;
Tabs.TabsContent = TabsContent;
Tabs.TabsContentSection = TabsContentSection;
Tabs.TabsDivider = TabsDivider;

export default Tabs;
