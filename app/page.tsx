"use client"
import { type SetStateAction, useState } from "react"
import { ShoppingCart, Search, Menu, User, Percent, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

interface Offer {
  id: string
  type: "percentage" | "fixed" | "bogo" | "bundle"
  value: number
  label: string
  labelAr: string
  description?: string
  descriptionAr?: string
  validUntil?: Date
  minQuantity?: number
}

interface Product {
  id: number
  name: string
  nameAr: string
  price: number
  image: string
  size: string
  brand: string
  offers?: Offer[]
}

const offers: Record<string, Offer> = {
  special50: {
    id: "special50",
    type: "percentage",
    value: 50,
    label: "50% OFF",
    labelAr: "خصم 50%",
    description: "Limited time offer",
    descriptionAr: "عرض لفترة محدودة",
  },
  special30: {
    id: "special30",
    type: "percentage",
    value: 30,
    label: "30% OFF",
    labelAr: "خصم 30%",
    description: "Special discount",
    descriptionAr: "خصم خاص",
  },
  bogo: {
    id: "bogo",
    type: "bogo",
    value: 1,
    label: "Buy 1 Get 1",
    labelAr: "اشتري واحد واحصل على آخر",
    description: "Buy one get one free",
    descriptionAr: "اشتري واحد واحصل على آخر مجاناً",
  },
  bundle3: {
    id: "bundle3",
    type: "bundle",
    value: 20,
    label: "3+ Bundle",
    labelAr: "عرض 3 قطع",
    description: "20% off when buying 3 or more",
    descriptionAr: "خصم 20% عند شراء 3 قطع أو أكثر",
    minQuantity: 3,
  },
  fixed2: {
    id: "fixed2",
    type: "fixed",
    value: 2,
    label: "2 OMR OFF",
    labelAr: "خصم 2 ريال",
    description: "Fixed discount",
    descriptionAr: "خصم ثابت",
  },
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
    offers: [offers.special30, offers.bundle3],
  },
  {
    id: 1,
    name: "Natural Water 500ml",
    nameAr: "مياه طبيعية 500 مل",
    price: 0.5,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "500ml",
    brand: "أكوا",
    offers: [offers.special50, offers.bogo],
  },
  {
    id: 2,
    name: "Natural Water 1.5L",
    nameAr: "مياه طبيعية 1.5 لتر",
    price: 1.2,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "1.5L",
    brand: "أكوا",
    offers: [offers.special30],
  },
  {
    id: 3,
    name: "Natural Water 330ml",
    nameAr: "مياه طبيعية 330 مل",
    price: 0.4,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "330ml",
    brand: "أكوا",
    offers: [offers.bogo],
  },
  {
    id: 4,
    name: "Natural Water 600ml",
    nameAr: "مياه طبيعية 600 مل",
    price: 0.7,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "600ml",
    brand: "أكوا",
    offers: [offers.bundle3],
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
    offers: [offers.fixed2],
  },
  {
    id: 7,
    name: "Natural Water 19L",
    nameAr: "مياه طبيعية 19 لتر",
    price: 8.0,
    image: "https://omanoasis.com/wp-content/uploads/2025/01/30-Anniversary-product-line-up_200ml-2.png",
    size: "19L",
    brand: "أكوا",
    offers: [offers.special50],
  },
]

function calculateDiscountedPrice(product: Product): { discountedPrice: number; bestOffer: Offer | null } {
  if (!product.offers || product.offers.length === 0) {
    return { discountedPrice: product.price, bestOffer: null }
  }

  let bestPrice = product.price
  let bestOffer: Offer | null = null

  product.offers.forEach((offer) => {
    let discountedPrice = product.price

    switch (offer.type) {
      case "percentage":
        discountedPrice = product.price * (1 - offer.value / 100)
        break
      case "fixed":
        discountedPrice = Math.max(0, product.price - offer.value)
        break
      case "bogo":
        // For display purposes, show 50% off for BOGO
        discountedPrice = product.price * 0.5
        break
      case "bundle":
        discountedPrice = product.price * (1 - offer.value / 100)
        break
    }

    if (discountedPrice < bestPrice) {
      bestPrice = discountedPrice
      bestOffer = offer
    }
  })

  return { discountedPrice: bestPrice, bestOffer }
}

function getOfferBadgeColor(offerType: string): string {
  switch (offerType) {
    case "percentage":
      return "bg-red-500 hover:bg-red-600"
    case "fixed":
      return "bg-orange-500 hover:bg-orange-600"
    case "bogo":
      return "bg-green-500 hover:bg-green-600"
    case "bundle":
      return "bg-purple-500 hover:bg-purple-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

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
              <img src="/Asset-2.png" className="h-12" />
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

      {/* Offers Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Gift className="h-4 w-4" />
            <span>عروض خاصة متاحة الآن - وفر حتى 50% على منتجات مختارة!</span>
            <Percent className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">المنتجات</h2>
          <p className="text-gray-600">اختيار أفضل أنواع المياه الطبيعية بأسعار مناسبة</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const { discountedPrice, bestOffer } = calculateDiscountedPrice(product)
            const hasDiscount = bestOffer && discountedPrice < product.price

            return (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
              >
                {/* Offer Corner Badge */}
                {bestOffer && (
                  <div className="absolute top-0 left-0 z-10">
                    <div
                      className={`${getOfferBadgeColor(bestOffer.type)} text-white px-3 py-1 text-xs font-bold transform -rotate-45 -translate-x-3 translate-y-2 shadow-lg`}
                    >
                      {bestOffer.labelAr}
                    </div>
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="aspect-[3/4] relative mb-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.nameAr}
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Offer Badges */}
                    {product.offers && product.offers.length > 0 && (
                      <div className="absolute bottom-2 right-2 left-2 flex flex-wrap gap-1 justify-center">
                        {product.offers.slice(0, 2).map((offer) => (
                          <Badge
                            key={offer.id}
                            className={`${getOfferBadgeColor(offer.type)} text-white text-xs px-2 py-1 shadow-md`}
                          >
                            {offer.labelAr}
                          </Badge>
                        ))}
                        {product.offers.length > 2 && (
                          <Badge className="bg-gray-500 text-white text-xs px-2 py-1">
                            +{product.offers.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.nameAr}</h3>
                    <p className="text-xs text-gray-500">{product.size}</p>

                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-lg font-bold text-red-600">{discountedPrice.toFixed(2)} ر.ع</span>
                            <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)} ر.ع</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-blue-600">{product.price.toFixed(2)} ر.ع</span>
                        )}
                      </div>
                      <Button
                        onClick={() => addToCart(product.id)}
                        size="sm"
                        className={hasDiscount ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                      >
                        إضافة للسلة
                      </Button>
                    </div>

                    {/* Offer Description */}
                    {bestOffer && bestOffer.descriptionAr && (
                      <p className="text-xs text-green-600 font-medium">{bestOffer.descriptionAr}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
