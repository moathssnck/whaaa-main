"use client"

import { ArrowRight, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: number
  name: string
  nameAr: string
  price: number
  image: string
  size: string
  brand: string
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartItems, getTotalPrice } = useCart()
  const cartItems = getCartItems()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-blue-600">سلة التسوق</h1>
            <div className="w-8 sm:w-10"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-6 py-2">تصفح المنتجات</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">المنتجات المختارة</h2>

              {cartItems.map((item) => (
                <Card key={item!.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                        <img
                          src={item!.image || "/placeholder.svg"}
                          alt={item!.nameAr}
                          width={60}
                          height={60}
                          className="object-contain w-12 h-12 sm:w-14 sm:h-14"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-right min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item!.nameAr}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item!.size}</p>
                        <p className="text-base sm:text-lg font-bold text-blue-600 mt-1 sm:mt-2">
                          {item!.price.toFixed(2)} ر.ع
                        </p>
                      </div>

                      {/* Quantity Controls and Remove Button */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white"
                            onClick={() => updateQuantity(item!.id, item!.quantity - 1)}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-8 sm:w-10 text-center font-semibold text-sm sm:text-base">
                            {item!.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white"
                            onClick={() => updateQuantity(item!.id, item!.quantity + 1)}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item!.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1 order-first xl:order-last">
              <Card className="sticky top-20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>المجموع الفرعي:</span>
                    <span className="font-medium">{getTotalPrice().toFixed(2)} ر.ع</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>رسوم التوصيل:</span>
                    <span className="font-medium">2.00 ر.ع</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>المجموع الكلي:</span>
                    <span className="text-blue-600">{(getTotalPrice() + 2).toFixed(2)} ر.ع</span>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-6 h-10 sm:h-11 text-sm sm:text-base">
                      متابعة الدفع
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
