"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { clearCart } = useCart()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsVerified(true)
    clearCart() // Clear cart after successful payment
    setIsLoading(false)
  }

  const handleResendOtp = () => {
    setTimeLeft(120)
    setOtp(["", "", "", "", "", ""])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم تأكيد الطلب بنجاح!</h2>
            <p className="text-gray-600 mb-6">شكراً لك! تم تأكيد طلبك وسيتم توصيله خلال 24 ساعة.</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">رقم الطلب: #OM2024001</p>
              <Link href="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">العودة للصفحة الرئيسية</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/checkout">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-blue-600">تأكيد رمز OTP</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">تأكيد رمز التحقق</CardTitle>
            <p className="text-gray-600 mt-2">
              تم إرسال رمز التحقق إلى رقم هاتفك
              <br />
              <span className="font-semibold">+968 9X XXX XXX</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-center block mb-4">أدخل رمز التحقق المكون من 6 أرقام</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                انتهاء صلاحية الرمز خلال: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
              </p>

              {timeLeft === 0 ? (
                <Button variant="outline" onClick={handleResendOtp}>
                  إعادة إرسال الرمز
                </Button>
              ) : (
                <Button
                  onClick={handleVerify}
                  disabled={otp.some((digit) => !digit) || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "جاري التحقق..." : "تأكيد الرمز"}
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>لم تستلم الرمز؟</p>
              <Button variant="link" className="p-0 h-auto text-blue-600" onClick={handleResendOtp}>
                إعادة الإرسال
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
