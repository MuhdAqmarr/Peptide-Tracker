import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getProfile } from '@/lib/db/dal/profiles';
import { SettingsView } from './settings-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('settings');

  let displayName = '';
  try {
    const profile = await getProfile();
    displayName = profile?.display_name ?? '';
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <SettingsView displayName={displayName} />
    </div>
  );
}
