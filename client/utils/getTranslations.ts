import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-i18next.config';

export async function getTranslations(locale: string, namespaces: string[]) {
  return await serverSideTranslations(locale, namespaces, nextI18NextConfig);
}   