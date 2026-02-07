import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [
    common,
    auth,
    dashboard,
    protocols,
    peptides,
    schedule,
    logs,
    settings,
    disclaimer,
    sites,
    inventory,
  ] = await Promise.all([
    import(`./messages/${locale}/common.json`),
    import(`./messages/${locale}/auth.json`),
    import(`./messages/${locale}/dashboard.json`),
    import(`./messages/${locale}/protocols.json`),
    import(`./messages/${locale}/peptides.json`),
    import(`./messages/${locale}/schedule.json`),
    import(`./messages/${locale}/logs.json`),
    import(`./messages/${locale}/settings.json`),
    import(`./messages/${locale}/disclaimer.json`),
    import(`./messages/${locale}/sites.json`),
    import(`./messages/${locale}/inventory.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      auth: auth.default,
      dashboard: dashboard.default,
      protocols: protocols.default,
      peptides: peptides.default,
      schedule: schedule.default,
      logs: logs.default,
      settings: settings.default,
      disclaimer: disclaimer.default,
      sites: sites.default,
      inventory: inventory.default,
    },
  };
});
