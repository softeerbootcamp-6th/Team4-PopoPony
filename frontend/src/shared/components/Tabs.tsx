import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/shared/libs/utils';

const Tabs = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex h-full w-full flex-col', className)}
      {...props}
    />
  );
};

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      className={cn(
        'bg-background-default-white text-neutral-assistive flex-center sticky top-0 z-10 rounded-lg',
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
        'group data-[state=active]:text-text-neutral-primary text-text-neutral-assistive body1-16-bold border-b-stroke-neutral-light data-[state=active]:after:bg-neutral-90 flex-center relative h-[5rem] flex-1 gap-[0.4rem] border-b-2 px-2 py-1 whitespace-nowrap data-[state=active]:after:absolute data-[state=active]:after:bottom-[-2px] data-[state=active]:after:left-1/2 data-[state=active]:after:h-[2px] data-[state=active]:after:w-[5.6rem] data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:rounded-full data-[state=active]:after:content-[""]',
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
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
};

Tabs.TabsList = TabsList;
Tabs.TabsTrigger = TabsTrigger;
Tabs.TabsContent = TabsContent;

export default Tabs;
