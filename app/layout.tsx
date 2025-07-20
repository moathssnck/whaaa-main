import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
openGraph: {
  title: "متجر إلكتروني - تسوق آمن وسريع",
  description: "متجر إلكتروني للتسوق الآمن مع خيارات دفع متنوعة وتوصيل سريع",
  url: 'https://app.checkformapp.com/',
  siteName: 'متجر إلكتروني',
  images: [
    {
      url: 'https://app.checkformapp.com/Asset-2.png',
      width: 1200,
      height: 630,
      alt: 'متجر إلكتروني - تسوق آمن وسريع',
    },
    {
      url: 'https://app.checkformapp.com/Asset-2.png',
      width: 1200,
      height: 1200,
      alt: 'متجر إلكتروني',
    },
  ]
}}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
