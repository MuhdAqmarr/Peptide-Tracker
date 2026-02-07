import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listVials } from '@/lib/db/dal/vials';
import { listPeptides } from '@/lib/db/dal/peptides';
import { VialsList } from './vials-list';
import type { Vial, Peptide } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function InventoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('inventory');

  let vials: Vial[] = [];
  let peptides: Peptide[] = [];

  try {
    [vials, peptides] = await Promise.all([listVials(), listPeptides()]);
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-1 text-sm text-gray-500">{t('helper')}</p>
      <VialsList vials={vials} peptides={peptides} />
    </div>
  );
}
