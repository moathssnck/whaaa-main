"use client"

import { SetStateAction, useState } from "react"
import { ShoppingCart, Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

const products: Product[] = [
  {
    id: 8,
    name: "Natural Water 18.9L",
    nameAr: "مياه طبيعية 18.9 لتر",
    price: 7.5,
    image: "https://omanoasis.com/wp-content/uploads/2024/11/5gallon.png",
    size: "18.9L",
    brand: "أكوا",
  },
  {
    id: 1,
    name: "Natural Water 500ml",
    nameAr: "مياه طبيعية 500 مل",
    price: 0.5,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "500ml",
    brand: "أكوا",
  },
  {
    id: 2,
    name: "Natural Water 1.5L",
    nameAr: "مياه طبيعية 1.5 لتر",
    price: 1.2,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "1.5L",
    brand: "أكوا",
  },
  {
    id: 3,
    name: "Natural Water 330ml",
    nameAr: "مياه طبيعية 330 مل",
    price: 0.4,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "330ml",
    brand: "أكوا",
  },
  {
    id: 4,
    name: "Natural Water 600ml",
    nameAr: "مياه طبيعية 600 مل",
    price: 0.7,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "600ml",
    brand: "أكوا",
  },
  {
    id: 5,
    name: "Natural Water 1L",
    nameAr: "مياه طبيعية 1 لتر",
    price: 1.0,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "1L",
    brand: "أكوا",
  },
  {
    id: 6,
    name: "Natural Water 5L",
    nameAr: "مياه طبيعية 5 لتر",
    price: 3.5,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "5L",
    brand: "أكوا",
  },
  {
    id: 7,
    name: "Natural Water 19L",
    nameAr: "مياه طبيعية 19 لتر",
    price: 8.0,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "19L",
    brand: "أكوا",
  },

]

export default function HomePage() {
  const { cart, addToCart, getCartItemCount } = useCart()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) => product.nameAr.includes(searchTerm) || product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
              <img src="/Asset-2.png" className="h-12"/>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">المنتجات</h2>
          <p className="text-gray-600">اختيار أفضل أنواع المياه الطبيعية بأسعار مناسبة</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="aspect-[3/4] relative mb-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.nameAr}
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                  />
<div className="grid grid-cols- justify-center text-center">
<Badge className="m-2 text-white w-20 p-1" variant={'destructive'}>عرض خاص</Badge>
<Badge className="bg-blue-500 m-2 p-1 text-white w-20" variant={'secondary'}>خصم 50%</Badge>

</div>

                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.nameAr}</h3>
                  <p className="text-xs text-gray-500">{product.size}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{product.price.toFixed(2)} ر.ع</span>
                    <Button onClick={() => addToCart(product.id)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      إضافة للسلة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">لم يتم العثور على منتجات</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">واحة عُمان</h3>
            <p className="text-gray-600 text-sm">أفضل أنواع المياه الطبيعية في سلطنة عُمان</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
