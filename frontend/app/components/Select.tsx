'use client'

import { Select as BaseSelect } from '@base-ui/react/select'

export interface SelectGroup {
  label: string
  options: string[]
}

export type SelectOption = string | SelectGroup

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="-mx-1.5"
      {...props}
    >
      <path d="M7 10L12 16.6667L17 10H7Z" fill="currentColor"></path>
    </svg>
  )
}

function SelectItem({ value }: { value: string }) {
  return (
    <BaseSelect.Item
      value={value}
      className="grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-1 px-3 py-1.5 text-sm outline-none data-highlighted:bg-background2 rounded-sm"
    >
      <BaseSelect.ItemIndicator className="col-start-1">
        •
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">{value}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

export default function Select({
  value,
  onValueChange,
  options,
  className,
}: SelectProps) {
  return (
    <BaseSelect.Root value={value} onValueChange={(v) => v && onValueChange(v)}>
      <BaseSelect.Trigger
        className={`inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground2 outline-none hover:border-border2 focus-visible:ring-2 focus-visible:ring-border2 ${className ?? ''}`}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="z-50 outline-none"
          alignItemWithTrigger={false}
          side="bottom"
          sideOffset={4}
        >
          <BaseSelect.Popup className="overflow-y-auto max-h-62 rounded-lg border border-border bg-background data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95 transition-[transform,opacity] duration-150 origin-(--transform-origin)">
            <BaseSelect.List className={'p-1'}>
              {options.map((option) => {
                if (typeof option === 'string') {
                  return <SelectItem key={option} value={option} />
                }
                return (
                  <BaseSelect.Group key={option.label}>
                    <BaseSelect.GroupLabel className="px-5 py-1.5 text-[10px] uppercase font-semibold text-foreground2/80 tracking-wider text-center">
                      {option.label}
                    </BaseSelect.GroupLabel>
                    {option.options.map((subOption) => (
                      <SelectItem key={subOption} value={subOption} />
                    ))}
                  </BaseSelect.Group>
                )
              })}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
