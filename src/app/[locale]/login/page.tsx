import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/auth/login-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations('auth');
  const td = useTranslations('disclaimer');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('signIn.title')}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{t('signIn.subtitle')}</p>
        </div>

        <LoginForm googleLabel={t('signIn.google')} />
      </div>

      <p className="max-w-sm text-center text-xs text-gray-400">
        {td('short')}
      </p>
    </div>
  );
}
