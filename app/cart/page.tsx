"use client"
import { ArrowRight, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-blue-600">سلة التسوق</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">تصفح المنتجات</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">المنتجات المختارة</h2>

              {cartItems.map((item) => (
                <Card key={item!.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <img
                          src={item!.image || "/placeholder.svg"}
                          alt={item!.nameAr}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item!.nameAr}</h3>
                        <p className="text-sm text-gray-500">{item!.size}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">{item!.price.toFixed(2)} ر.ع</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item!.id, item!.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item!.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item!.id, item!.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item!.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{getTotalPrice().toFixed(2)} ر.ع</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم التوصيل:</span>
                    <span>2.00 ر.ع</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع الكلي:</span>
                    <span>{(getTotalPrice() + 2).toFixed(2)} ر.ع</span>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-6">متابعة الدفع</Button>
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
