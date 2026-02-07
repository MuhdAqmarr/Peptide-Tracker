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
    <div className="flex flex-col items-center gap-8 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t('appName')}</h1>
      <p className="max-w-md text-lg text-gray-600">{td('short')}</p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('nav.dashboard')}
        </Link>
        <Link
          href="/protocols"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
        >
          {t('nav.protocols')}
        </Link>
      </div>
    </div>
  );
}
