import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('common');
  const td = useTranslations('disclaimer');

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-12 text-center sm:gap-8 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('appName')}</h1>
      <p className="max-w-md text-base text-gray-600 sm:text-lg">{td('short')}</p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('nav.dashboard')}
        </Link>
        <Link
          href="/protocols"
          className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100"
        >
          {t('nav.protocols')}
        </Link>
      </div>
    </div>
  );
}
