'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeModal() {
  const t = useTranslations('welcome');
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Dacă utilizatorul este autentificat, nu afișăm modalul
    if (user) {
      setIsOpen(false);
      setShowReminder(false);
      return;
    }

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
      setShowReminder(false);
    } else {
      setIsOpen(false);
      // Setăm un timer de 30 secunde pentru afișarea notificării
      const timer = setTimeout(() => {
        // Verificăm din nou dacă utilizatorul nu este autentificat
        if (!user) {
          setShowReminder(true);
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    // Nu mai numărăm click-urile dacă utilizatorul este autentificat
    if (user) return;

    const handleClick = () => {
      if (!isOpen) {
        setClickCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5 && !user) {
            setShowReminder(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, user]);

  const handleCreateAccount = () => {
    setIsOpen(false);
    setShowReminder(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    router.push('/register');
  };

  const handleSkipForNow = () => {
    setIsOpen(false);
    setClickCount(0);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReminder(false);
  };

  if (user || (!isOpen && !showReminder)) return null;

  if (showReminder) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          onClick={handleCreateAccount}
          className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 rounded-lg p-3 shadow-lg max-w-[600px] relative cursor-pointer hover:from-purple-800/90 hover:to-pink-800/90 transition-all group flex items-center justify-between gap-4"
        >
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm truncate">{t('reminder.description')}</p>
            </div>
            <div className="shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1.5 rounded-md font-medium text-sm group-hover:from-pink-600 group-hover:to-purple-700 transition-all whitespace-nowrap">
              {t('reminder.createAccount')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-gradient-to-b from-purple-900/90 to-pink-900/90 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/vice-city-casino.jpg"
            alt="Vice City Casino"
            fill
            className="object-cover opacity-50"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-cyan-400 mb-3 leading-tight">
              {t('title')}
            </h1>
            <p className="text-gray-200 text-lg">
              {t('description')}
            </p>
          </div>

          {/* Expert Content Box */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-4 rounded-xl backdrop-blur-sm w-full text-center">
            <h2 className="text-xl font-semibold text-pink-300 mb-2">
              {t('expertContent.title')}
            </h2>
            <p className="text-gray-200">
              {t('expertContent.description')}
            </p>
          </div>

          {/* AI-Powered Box */}
          <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 p-4 rounded-xl backdrop-blur-sm w-full text-center">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">
              {t('aiAssistance.title')}
            </h2>
            <p className="text-gray-200">
              {t('aiAssistance.description')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-2 w-full">
            <button
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all text-lg"
            >
              {t('buttons.createAccount')}
            </button>
            <button
              onClick={handleSkipForNow}
              className="w-full bg-transparent border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/10 transition-all text-lg"
            >
              {t('buttons.skipForNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 