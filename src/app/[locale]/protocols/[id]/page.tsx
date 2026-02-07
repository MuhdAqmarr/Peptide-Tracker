import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getProtocol } from '@/lib/db/dal/protocols';
import { listProtocolItems } from '@/lib/db/dal/protocolItems';
import { listPeptides } from '@/lib/db/dal/peptides';
import { ProtocolDetail } from './protocol-detail';
import type { Protocol, ProtocolItem, Peptide } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProtocolDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('protocols');

  let protocol: Protocol | null = null;
  let items: ProtocolItem[] = [];
  let peptides: Peptide[] = [];

  try {
    protocol = await getProtocol(id);
    if (protocol) {
      [items, peptides] = await Promise.all([
        listProtocolItems(id),
        listPeptides(),
      ]);
    }
  } catch {
    // DB not connected — show not found
  }

  if (!protocol) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{protocol.name}</h1>
        <p className="text-sm text-gray-500">
          {protocol.start_date}
          {protocol.end_date && ` → ${protocol.end_date}`}
          {' · '}
          {protocol.timezone}
        </p>
      </div>

      <h2 className="text-lg font-semibold">{t('title')}</h2>
      <ProtocolDetail
        protocol={protocol}
        items={items}
        peptides={peptides}
      />
    </div>
  );
}
