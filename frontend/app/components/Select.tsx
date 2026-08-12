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

function CaretDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.9999 9C17.3878 9.00005 17.7406 9.22483 17.9051 9.57617C18.0696 9.92749 18.0167 10.3426 17.7684 10.6406L12.7684 16.6406C12.5785 16.8685 12.2966 17 11.9999 17C11.7032 17 11.4213 16.8685 11.2313 16.6406L6.23131 10.6406C5.98294 10.3426 5.9301 9.92753 6.09459 9.57617C6.25918 9.22482 6.61187 9 6.99987 9H16.9999Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SelectItem({ value }: { value: string }) {
  return (
    <BaseSelect.Item
      value={value}
      className="grid cursor-default select-none grid-cols-[1fr_1rem] items-center gap-1 px-2 py-1.5 text-sm outline-none data-highlighted:bg-background2 rounded-sm"
    >
      <BaseSelect.ItemText className="col-start-1">{value}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="col-start-2 justify-self-end">
        •
      </BaseSelect.ItemIndicator>
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
        className={`inline-flex w-fit items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-foreground2 outline-none hover:border-border2 focus-visible:ring-2 focus-visible:ring-border2 ${className ?? ''}`}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <CaretDownIcon className='text-foreground2/80 ml-1 -mr-1' />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="z-50 outline-none"
          alignItemWithTrigger={false}
          align="start"
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
                    <BaseSelect.GroupLabel className="px-2 py-1.5 text-[10px] uppercase font-semibold text-foreground2/80 tracking-wider text-left">
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
