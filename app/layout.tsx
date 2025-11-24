import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AccessibilityProvider } from "@/lib/accessibility-context";
import { AuthProvider } from "@/lib/auth-context";
import { LocationProvider } from "@/lib/location-context";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FoodPapa - Order Food Online",
  description: "Modern food delivery app - Order your favorite food from the best restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased bg-[#F8F9FA]`} suppressHydrationWarning>
          <AuthProvider>
            <AccessibilityProvider>
              <LocationProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </LocationProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
