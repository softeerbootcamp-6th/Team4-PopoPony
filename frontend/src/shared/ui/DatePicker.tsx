import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import * as React from 'react';

import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@shared/lib';
import { ShadCnButton as Button, shadCnButtonVariants as buttonVariants } from '@shared/ui';

const DatePicker = ({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  startMonth = new Date(2024, 0),
  endMonth = new Date(2030, 11),
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn(
        'bg-background-default-white shadow-card border-stroke-neutral-dark group/calendar rounded-md border p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-xl font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-stroke-neutral-dark border border-stroke-neutral-light shadow-xs has-focus:ring-mint-50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute bg-background-default-white inset-0 opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none font-medium text-text-neutral-primary',
          captionLayout === 'label'
            ? 'text-xl'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-xl h-8 [&>svg]:text-text-neutral-secondary [&>svg]:size-4.5',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-text-neutral-secondary rounded-md flex-1 font-normal text-[1rem] select-none',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        week_number: cn(
          'text-[1rem] select-none text-text-neutral-secondary',
          defaultClassNames.week_number
        ),
        day: cn(
          'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-md bg-mint-10', defaultClassNames.range_start),
        range_middle: cn('rounded-none bg-mint-10', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md bg-mint-10', defaultClassNames.range_end),
        today: cn(
          'bg-mint-5 rounded-md data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'text-text-neutral-assistive aria-selected:text-text-neutral-assistive',
          defaultClassNames.outside
        ),
        disabled: cn('text-text-neutral-disabled opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot='calendar' ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('text-text-neutral-secondary size-8', className)}
                {...props}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('text-text-neutral-secondary size-8', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn('text-text-neutral-secondary size-4', className)}
              {...props}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className='flex size-(--cell-size) items-center justify-center text-center'>
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
};

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant='ghost'
      size='default'
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'hover:bg-neutral-10 data-[selected-single=true]:bg-mint-50 data-[selected-single=true]:text-neutral-0 data-[range-middle=true]:bg-mint-10 data-[range-middle=true]:text-mint-60 data-[range-start=true]:bg-mint-50 data-[range-start=true]:text-neutral-0 data-[range-end=true]:bg-mint-50 data-[range-end=true]:text-neutral-0 group-data-[focused=true]/day:border-mint-50 group-data-[focused=true]/day:ring-mint-50/50 hover:text-text-neutral-primary flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        'text-xl',
        className
      )}
      {...props}
    />
  );
};

export { DatePicker, CalendarDayButton };
