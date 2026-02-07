import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listProtocols } from '@/lib/db/dal/protocols';
import { ProtocolsList } from './protocols-list';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProtocolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('protocols');

  let protocols: Awaited<ReturnType<typeof listProtocols>> = [];
  try {
    protocols = await listProtocols();
  } catch {
    // DB not connected yet or table doesn't exist — show empty state
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
      <ProtocolsList protocols={protocols} />
    </div>
  );
}
