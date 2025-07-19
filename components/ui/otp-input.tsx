"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete?: (otp: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  loading?: boolean
  label?: string
  placeholder?: string
  error?: string
  className?: string
}

export function OTPInput({
  length = 6,
  onComplete,
  onError,
  disabled = false,
  loading = false,
  label = "أدخل رمز التحقق",
  placeholder = "",
  error,
  className,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const [localError, setLocalError] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  const validateInput = (value: string): boolean => {
    // Check if value is a single digit
    if (!/^\d$/.test(value)) {
      setLocalError("يرجى إدخال أرقام فقط")
      onError?.("يرجى إدخال أرقام فقط")
      return false
    }
    return true
  }

  const handleChange = (index: number, value: string) => {
    // Clear any existing errors
    setLocalError("")

    // Handle paste operation
    if (value.length > 1) {
      const pastedData = value.slice(0, length)
      const pastedArray = pastedData.split("")

      // Validate all pasted digits
      if (!pastedArray.every((digit) => /^\d$/.test(digit))) {
        setLocalError("يرجى إدخال أرقام فقط")
        onError?.("يرجى إدخال أرقام فقط")
        return
      }

      const newOtp = [...otp]
      pastedArray.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit
        }
      })

      setOtp(newOtp)

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedArray.length, length - 1)
      inputRefs.current[nextIndex]?.focus()

      // Check if OTP is complete
      if (newOtp.every((digit) => digit !== "")) {
        onComplete?.(newOtp.join(""))
      }
      return
    }

    // Handle single character input
    if (value && !validateInput(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (otp[index]) {
        // Clear current input
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === "ArrowRight" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select()
  }

  const displayError = error || localError

  return (
    <div className={cn("space-y-4", className)} dir="rtl">
      {label && <Label className="text-sm font-medium text-center block">{label}</Label>}

      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled || loading}
            placeholder={placeholder}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold",
              displayError && "border-red-500 focus-visible:ring-red-500",
              loading && "opacity-50",
            )}
            aria-label={`الرقم ${index + 1}`}
          />
        ))}
      </div>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
