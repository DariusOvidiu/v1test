'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale: params.locale }),
      });

      if (response.ok) {
        toast.success(t('resetPassword.emailSent'));
        router.push(`/${params.locale}/login`);
      } else {
        const data = await response.json();
        toast.error(data.message || t('resetPassword.error'));
      }
    } catch (error) {
      toast.error(t('resetPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {t('resetPassword.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {t('resetPassword.description')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              {t('common.email')}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('common.email')}
              className="appearance-none rounded-lg relative block w-full px-4 py-2 bg-white/10 border border-gray-400/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50"
            >
              {isLoading ? t('common.loading') : t('resetPassword.submit')}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push(`/${params.locale}/login`)}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              {t('resetPassword.backToLogin')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 