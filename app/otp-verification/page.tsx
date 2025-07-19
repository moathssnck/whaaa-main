"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { OTPInput } from "@/components/ui/otp-input"

export default function OTPDemo() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isVerified])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue)
    setError("")
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("يرجى إدخال رمز مكون من 6 أرقام")
      return
    }

    if (timeLeft === 0) {
      setError("انتهت صلاحية الرمز. يرجى طلب رمز جديد")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate different scenarios based on OTP
      if (otp === "123456") {
        setIsVerified(true)
      } else if (otp === "000000") {
        throw new Error("رمز التحقق غير صحيح")
      } else if (attempts >= 2) {
        throw new Error("تم تجاوز عدد المحاولات المسموحة. يرجى طلب رمز جديد")
      } else {
        setAttempts((prev) => prev + 1)
        throw new Error("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في التحقق")
      setOtp("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleResend = () => {
    setOtp("")
    setError("")
    setAttempts(0)
    setIsVerified(false)
    setTimeLeft(120)
  }

  if (isVerified) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4"
        dir="rtl"
      >
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التحقق بنجاح!</h2>
            <p className="text-gray-600 mb-6">تم تأكيد حسابك بنجاح. مرحباً بك!</p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">رقم العملية: #VER2024001</p>
              <Button onClick={handleResend} className="w-full bg-green-600 hover:bg-green-700">
                العودة للصفحة الرئيسية
              </Button>
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
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-blue-600">تأكيد رمز التحقق</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">أدخل رمز التحقق</CardTitle>
            <p className="text-gray-600 mt-2">
              تم إرسال رمز التحقق إلى رقم هاتفك
              <br />
              <span className="font-semibold">+968 9X XXX XXX</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              onError={handleOTPError}
              loading={isLoading}
              error={error}
              label="أدخل رمز التحقق المكون من 6 أرقام"
            />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                انتهاء صلاحية الرمز خلال:{" "}
                <span className={cn("font-semibold", timeLeft <= 30 ? "text-red-600" : "text-blue-600")}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {timeLeft === 0 ? (
                <Button onClick={handleResend} variant="outline" className="w-full bg-transparent">
                  إعادة إرسال الرمز
                </Button>
              ) : (
                <Button
                  onClick={handleVerify}
                  disabled={otp.length !== 6 || isLoading || timeLeft === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "جاري التحقق..." : "تأكيد الرمز"}
                </Button>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">لم تستلم الرمز؟</p>
                <Button
                  variant="link"
                  onClick={handleResend}
                  className="p-0 h-auto text-blue-600"
                  disabled={timeLeft > 60} // Can only resend after 1 minute
                >
                  {timeLeft > 60 ? `إعادة الإرسال خلال ${Math.ceil((timeLeft - 60) / 60)} دقيقة` : "إعادة الإرسال"}
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  )
}
