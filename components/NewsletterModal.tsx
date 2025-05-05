'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function NewsletterModal() {
  const t = useTranslations('newsletter');
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const hasSubscribed = localStorage.getItem('newsletterSubscribed');
    const lastClosed = localStorage.getItem('newsletterLastClosed');
    
    if (!user && !hasSubscribed && (!lastClosed || new Date().getTime() - parseInt(lastClosed) > 24 * 60 * 60 * 1000)) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !acceptTerms) {
      setError(t('requiredFields'));
      return;
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, acceptTerms }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('newsletterSubscribed', 'true');
        setIsOpen(false);
        alert(t('successMessage'));
      } else {
        setError(t(data.error === 'Adresa de email nu este validă' ? 'invalidEmail' :
                  data.error === 'Această adresă de email este deja înregistrată' ? 'emailExists' :
                  'errorMessage'));
      }
    } catch (error) {
      console.error('Eroare la trimiterea datelor:', error);
      setError(t('errorMessage'));
    }
  };

  const handleLater = () => {
    localStorage.setItem('newsletterLastClosed', new Date().getTime().toString());
    setIsOpen(false);
    setShowReminder(true);
    setTimeout(() => setShowReminder(false), 5000);
  };

  if (!isOpen) {
    return showReminder ? (
      <div className="fixed top-4 right-4 bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-lg shadow-xl z-50 max-w-sm animate-slide-in">
        <p className="text-white text-sm">
          {t('reminder')}
        </p>
      </div>
    ) : null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-lg max-w-md w-full mx-4 relative">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
          <p className="mb-6">{t('description')}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded">
                {error}
              </div>
            )}
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/70"
              required
            />
            
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <label className="text-sm">{t('terms')}</label>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-white text-purple-600 py-2 rounded hover:bg-white/90 transition"
              >
                {t('subscribe')}
              </button>
              <button
                type="button"
                onClick={handleLater}
                className="flex-1 border border-white text-white py-2 rounded hover:bg-white/10 transition"
              >
                {t('later')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showReminder && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <p className="text-gray-800">{t('reminder')}</p>
          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
} 