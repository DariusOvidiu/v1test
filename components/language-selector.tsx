"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslation } from "@/hooks/useTranslation"
import { usePathname, useRouter } from "next/navigation"

const languageNames = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français"
}

export function LanguageSelector() {
  const { language, country, setLanguage, setCountry } = useLanguage()
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const handleApply = () => {
    // Obținem calea curentă fără prefixul de limbă
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '')
    // Redirecționăm către noua limbă
    router.push(`/${language}${currentPath}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent border border-gray-700 text-white hover:bg-gray-800">
          {languageNames[language as keyof typeof languageNames]} | {t('language.select')}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-[#00FFE7]">{t('language.select')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-[#FF5ACD] block mb-2">{t('language.language')}</label>
            <Select value={language} onValueChange={(value: string) => setLanguage(value as any)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder={t('language.language')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en" className="text-white">English</SelectItem>
                <SelectItem value="es" className="text-white">Español</SelectItem>
                <SelectItem value="de" className="text-white">Deutsch</SelectItem>
                <SelectItem value="fr" className="text-white">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[#FF5ACD] block mb-2">{t('language.country')}</label>
            <Select value={country} onValueChange={(value: string) => setCountry(value as any)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder={t('language.country')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="us" className="text-white">United States</SelectItem>
                <SelectItem value="uk" className="text-white">United Kingdom</SelectItem>
                <SelectItem value="ca" className="text-white">Canada</SelectItem>
                <SelectItem value="au" className="text-white">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleApply}
            className="w-full bg-[#FF5ACD] hover:bg-[#FF5ACD]/90 text-white"
          >
            {t('language.apply')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 