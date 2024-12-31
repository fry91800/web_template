import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../../next-i18next.config';
import { useTranslation } from 'next-i18next';

const Products: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('products_title')}</h1>
      <p>{t('products_description')}</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const locales = ['en', 'fr']; // Supported locales
  const paths = locales.map((locale) => ({
    params: { locale }, // Matches the `[locale]` dynamic route
  }));

  return {
    paths,
    fallback: false, // 404 for undefined locales
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // Check if params?.locale is an array or a string
    const currentLocale = Array.isArray(params?.locale) ? params?.locale[0] : params?.locale || 'en';
  
    console.log('Locale detected:', currentLocale);
  
    // Ensure that the locale is a string before passing it to serverSideTranslations
    const translations = await serverSideTranslations(currentLocale, ['common'], nextI18NextConfig);
  
    console.log('Translations:', translations);
  
    return {
      props: {
        ...translations,
      },
    };
  };

export default Products;
