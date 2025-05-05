"use client"

import Image from "next/image"
import { Search, LogOut, User } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageSelector } from "./language-selector"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Notifications from './Notifications'

export default function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-black border-b border-neon-purple/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <a href="/" className="mr-4">
              <div className="relative h-10 w-32">
                <Image
                  src="/placeholder.svg?height=40&width=128"
                  alt="Casino Guru Vice City"
                  width={128}
                  height={40}
                  className="object-contain"
                />
              </div>
            </a>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder={t("search.placeholder")}
                className="w-[500px] py-2 px-4 pr-10 rounded bg-gray-800 border border-neon-purple/30 focus:border-neon-pink focus:outline-none text-white"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <>
                <Notifications />
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  {t('signUp')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Language and Country Selector Modal */}
      <div id="language-modal" className="hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-gray-900 border border-neon-purple rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-orbitron text-neon-cyan">Select Language & Country</h3>
            <button
              onClick={() => document.getElementById("language-modal")?.classList.add("hidden")}
              className="text-gray-400 hover:text-neon-pink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-neon-pink font-orbitron mb-3">Language</h4>
            <div className="grid grid-cols-2 gap-2">
              {["English", "German", "French", "Spanish", "Italian", "Portuguese"].map((lang) => (
                <button key={lang} className="text-left px-3 py-2 rounded hover:bg-neon-purple/20 transition">
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-neon-pink font-orbitron mb-3">Country</h4>
            <div className="grid grid-cols-2 gap-2">
              {["United States", "United Kingdom", "Germany", "France", "Spain", "Italy"].map((country) => (
                <button key={country} className="text-left px-3 py-2 rounded hover:bg-neon-purple/20 transition">
                  {country}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-neon-pink text-black font-orbitron py-2 rounded hover:bg-neon-cyan transition">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}
