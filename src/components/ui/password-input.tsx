"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  containerClassName?: string
}

function PasswordInput({
  className,
  containerClassName,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("ps-3 pe-10", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute inset-y-0 end-1 my-auto"
        onClick={() => setShowPassword((currentValue) => !currentValue)}
      >
        {showPassword ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
        <span className="sr-only">
          {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        </span>
      </Button>
    </div>
  )
}

export { PasswordInput }
