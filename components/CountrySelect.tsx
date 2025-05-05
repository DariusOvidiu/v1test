'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { countries } from '@/lib/countries';
import { useTranslations } from 'next-intl';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export default function CountrySelect({ value, onChange, error, className = '' }: CountrySelectProps) {
  const t = useTranslations('register');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry = countries.find(c => c.code === value);
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <span className="mr-2 text-xl">
              {selectedCountry.flag}
            </span>
            <span>
              {selectedCountry.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">{t('placeholders.country')}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700 shadow-xl max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('placeholders.searchCountry')}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="py-1">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-cyan-500/20 flex items-center space-x-3"
              >
                <span className="text-xl">{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-2 text-gray-400 text-center">
                {t('noCountriesFound')}
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
} 