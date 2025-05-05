"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const t = useTranslations('common');
  const router = useRouter();
  const { user } = useAuth();

  return (
    <header className="bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo și Navigare */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/placeholder.svg"
                alt="Casino Guru"
                width={120}
                height={32}
                className="h-8"
              />
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/online-casinos" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Online Casinos
              </Link>
              <Link href="/games" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Games
              </Link>
              <Link href="/bonuses" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Bonuses
              </Link>
              <Link href="/guide" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Guide
              </Link>
              <Link href="/reviews" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Reviews
              </Link>
              <Link href="/tournaments" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                Tournaments
              </Link>
              <Link href="/news" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
                News
              </Link>
            </nav>
          </div>

          {/* Căutare și Autentificare */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for casinos, games, and more"
                className="w-64 bg-gray-900 text-white text-sm rounded-md pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <LanguageSelector />

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">{user.username}</span>
                <button
                  onClick={() => router.push('/logout')}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 