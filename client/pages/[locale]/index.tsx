import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { getTranslations } from '../../utils/getTranslations';

const Products: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>Express app !</h1>
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
  const currentLocale = Array.isArray(params?.locale) ? params?.locale[0] : params?.locale || 'en';
  const translations = await getTranslations(currentLocale, ['common']);

  return {
    props: {
      ...translations,
    },
  };
};

export default Products;
