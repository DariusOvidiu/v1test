'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ResetPassword() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('resetPassword.passwordsDoNotMatch'));
      return;
    }

    if (!token) {
      toast.error(t('resetPassword.invalidToken'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password, locale: params.locale }),
      });

      if (response.ok) {
        toast.success(t('resetPassword.success'));
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-900 p-4">
        <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {t('resetPassword.invalidToken')}
          </h2>
          <Button
            onClick={() => router.push(`/${params.locale}/forgot-password`)}
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            {t('resetPassword.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {t('resetPassword.newPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {t('resetPassword.enterNewPassword')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                {t('common.password')}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('common.password')}
                className="appearance-none rounded-lg relative block w-full px-4 py-2 bg-white/10 border border-gray-400/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t('resetPassword.confirmPassword')}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('resetPassword.confirmPassword')}
                className="appearance-none rounded-lg relative block w-full px-4 py-2 bg-white/10 border border-gray-400/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>
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
        </form>
      </div>
    </div>
  );
} 