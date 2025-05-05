import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Casino Guru - Vice City Edition",
  description: "Your ultimate guide to online gambling",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} bg-black text-white min-h-screen`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
