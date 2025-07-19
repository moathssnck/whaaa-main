"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
    image: "https://omanoasis.com/wp-content/uploads/2024/11/5gallon.png",
    size: "19L",
    brand: "أكوا",
  },
  {
    id: 8,
    name: "Natural Water 18.9L",
    nameAr: "مياه طبيعية 18.9 لتر",
    price: 7.5,
    image: "https://omanoasis.com/wp-content/uploads/2024/11/5gallon.png",
    size: "18.9L",
    brand: "أكوا",
  },
]

interface CartContextType {
  cart: { [key: number]: number }
  addToCart: (productId: number) => void
  updateQuantity: (productId: number, newQuantity: number) => void
  removeFromCart: (productId: number) => void
  getCartItemCount: () => number
  getCartItems: () => (Product & { quantity: number })[]
  getTotalPrice: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("water-store-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("water-store-cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const newCart = { ...cart }
      delete newCart[productId]
      setCart(newCart)
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }))
    }
  }

  const removeFromCart = (productId: number) => {
    const newCart = { ...cart }
    delete newCart[productId]
    setCart(newCart)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const getCartItems = () => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === Number.parseInt(productId))
        return product ? { ...product, quantity } : null
      })
      .filter(Boolean) as (Product & { quantity: number })[]
  }

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const clearCart = () => {
    setCart({})
  }

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartItemCount,
    getCartItems,
    getTotalPrice,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
