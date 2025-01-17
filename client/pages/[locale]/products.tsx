import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { getTranslations } from '../../utils/getTranslations';

const Products: React.FC<{ message: string }> = ({message}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('products_title')}</h1>
      <p>{t('products_description')}</p>
      <p>{message}</p>
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
    // Fetch the message from the server with the appropriate Accept-Language header
    const res = await fetch('http://localhost:3001/message', {
      headers: {
        'Accept-Language': currentLocale, // Send the correct locale in the header
      },
    });
    const responseJson = await res.json();

  return {
    props: {
      ...translations, // Pass translations to the page component as props
      message: responseJson.message,
    },
  };
};

export default Products;
