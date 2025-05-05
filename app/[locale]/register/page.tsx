'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, Search } from 'lucide-react';
import { countries } from '@/lib/countries';
import { phonePrefixes } from '@/lib/phonePrefixes';
import { useAuth } from '@/contexts/AuthContext';

interface Country {
  name: string;
  code: string;
  flag: string;
}

export default function RegisterPage() {
  const t = useTranslations('register');
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    country: '',
    phone: '',
    interests: [] as string[],
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (countryCode: string) => {
    setFormData(prev => ({ ...prev, country: countryCode }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
    if (errors.country) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.country;
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name === 'interests') {
        const interests = [...formData.interests];
        if (checkbox.checked) {
          interests.push(value);
        } else {
          const index = interests.indexOf(value);
          if (index > -1) {
            interests.splice(index, 1);
          }
        }
        setFormData(prev => ({ ...prev, interests }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.passwordLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsDoNotMatch');
    }

    if (!formData.username) {
      newErrors.username = t('errors.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('errors.usernameLength');
    }

    if (!formData.country) {
      newErrors.country = t('errors.countryRequired');
    }

    if (formData.interests.length === 0) {
      newErrors.interests = t('errors.interestsRequired');
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('errors.acceptTermsRequired');
    }

    if (!formData.phone) {
      newErrors.phone = t('errors.phoneRequired');
    } else {
      const phoneRegex = /^\d{6,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = t('errors.phoneInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          country: data.user.country,
          interests: JSON.parse(data.user.interests)
        });
        router.push('/');
      } else {
        setErrors({ submit: data.message || t('errors.generalError') });
      }
    } catch (error) {
      setErrors({ submit: t('errors.generalError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-gray-300">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.username')}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder={t('placeholders.username')}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder={t('placeholders.email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Country Select */}
            <div className="relative">
              <label htmlFor="country" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.country')}
              </label>
              <div className="relative">
                <div
                  className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white cursor-pointer flex items-center justify-between"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                >
                  {formData.country ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">
                        {countries.find(c => c.code === formData.country)?.flag}
                      </span>
                      <span>
                        {countries.find(c => c.code === formData.country)?.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">{t('placeholders.country')}</span>
                  )}
                </div>

                {isCountryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700 shadow-xl max-h-64 overflow-y-auto">
                    <div className="sticky top-0 bg-gray-900 p-2 border-b border-gray-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
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
                          onClick={() => handleCountrySelect(country.code)}
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
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-red-400">{errors.country}</p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.phone')}
              </label>
              <div className="relative flex">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-r-0 border-gray-400/20 rounded-l-lg text-white">
                    {formData.country ? phonePrefixes[formData.country] || '+' : '+'}
                  </div>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 bg-white/10 border border-gray-400/20 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder={t('placeholders.phone')}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                {t('fields.interests')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex items-start group">
                  <input
                    type="checkbox"
                    name="interests"
                    value="casino"
                    checked={formData.interests.includes('casino')}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-4 flex items-center justify-center w-full h-[100px] bg-cover bg-center bg-no-repeat border border-gray-400/20 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-cyan-500 peer-checked:ring-2 peer-checked:ring-cyan-500 group-hover:border-gray-400/40"
                    style={{ backgroundImage: `url('/images/interests/casinov2.png')` }}
                  >
                  </div>
                  <Check className="absolute right-2 top-4 text-cyan-500 opacity-0 transition-opacity duration-200 peer-checked:opacity-100 z-10" size={24} />
                </label>
                <label className="relative flex items-start group">
                  <input
                    type="checkbox"
                    name="interests"
                    value="sport"
                    checked={formData.interests.includes('sport')}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="p-4 flex items-center justify-center w-full h-[100px] bg-cover bg-center bg-no-repeat border border-gray-400/20 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-cyan-500 peer-checked:ring-2 peer-checked:ring-cyan-500 group-hover:border-gray-400/40"
                    style={{ backgroundImage: `url('/images/interests/sportv2.png')` }}
                  >
                  </div>
                  <Check className="absolute right-2 top-4 text-cyan-500 opacity-0 transition-opacity duration-200 peer-checked:opacity-100 z-10" size={24} />
                </label>
              </div>
              {errors.interests && (
                <p className="mt-1 text-sm text-red-400">{errors.interests}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder={t('placeholders.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                {t('fields.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder={t('placeholders.confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-200">
                {t('fields.acceptTerms')}
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-400">{errors.acceptTerms}</p>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('loading') : t('submit')}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            {t('alreadyHaveAccount')}{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              {t('loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 