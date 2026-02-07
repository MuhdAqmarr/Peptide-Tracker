import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listPeptides } from '@/lib/db/dal/peptides';
import { PeptidesList } from './peptides-list';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PeptidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('peptides');

  let peptides: Awaited<ReturnType<typeof listPeptides>> = [];
  try {
    peptides = await listPeptides();
  } catch {
    // DB not connected yet or table doesn't exist — show empty state
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
      <PeptidesList peptides={peptides} />
    </div>
  );
}
