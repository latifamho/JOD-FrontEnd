"use client"

import * as React from "react"
import { format } from "date-fns"
import { arSA } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "اختر التاريخ",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    defaultValue
  )

  const selectedDate = value === undefined ? internalValue : value

  const handleSelect = (date: Date | undefined) => {
    if (value === undefined) {
      setInternalValue(date)
    }

    onValueChange?.(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-right font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          {selectedDate
            ? format(selectedDate, "PPP", { locale: arSA })
            : placeholder}
          <CalendarIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={arSA}
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
