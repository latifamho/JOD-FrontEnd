"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const countryCodeOptions = [
  { label: "السعودية (+966)", value: "+966" },
  { label: "الإمارات (+971)", value: "+971" },
  { label: "الكويت (+965)", value: "+965" },
  { label: "قطر (+974)", value: "+974" },
]

type PhoneNumberInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (fullPhoneNumber: string) => void
  countryCode?: string
  defaultCountryCode?: string
  onCountryCodeChange?: (countryCode: string) => void
  containerClassName?: string
}

function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "")
}

function PhoneNumberInput({
  value,
  defaultValue,
  onValueChange,
  countryCode,
  defaultCountryCode = "+966",
  onCountryCodeChange,
  className,
  containerClassName,
  ...props
}: PhoneNumberInputProps) {
  const [internalNumber, setInternalNumber] = React.useState(defaultValue ?? "")
  const [internalCountryCode, setInternalCountryCode] = React.useState(
    defaultCountryCode
  )

  const selectedCountryCode =
    countryCode === undefined ? internalCountryCode : countryCode
  const number = value === undefined ? internalNumber : value

  const emitChange = React.useCallback(
    (nextCountryCode: string, nextNumber: string) => {
      onValueChange?.(`${nextCountryCode}${normalizePhoneNumber(nextNumber)}`)
    },
    [onValueChange]
  )

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNumber = event.target.value

    if (value === undefined) {
      setInternalNumber(nextNumber)
    }

    emitChange(selectedCountryCode, nextNumber)
  }

  const handleCountryCodeChange = (nextCountryCode: string) => {
    if (countryCode === undefined) {
      setInternalCountryCode(nextCountryCode)
    }

    onCountryCodeChange?.(nextCountryCode)
    emitChange(nextCountryCode, number)
  }

  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-[160px] bg-light-50">
          <SelectValue placeholder="مفتاح الدولة" />
        </SelectTrigger>
        <SelectContent>
          {countryCodeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        {...props}
        type="tel"
        inputMode="numeric"
        dir="ltr"
        value={number}
        onChange={handleNumberChange}
        className={cn("flex-1", className)}
      />
    </div>
  )
}

export { PhoneNumberInput }
