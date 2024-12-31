import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation(); // Automatically uses the default namespace (e.g., 'common')

  return <h1>Hello, Next.js and Express! {t('test')}</h1>;
};

// Use getStaticProps to load translations on the server side
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])), // Load the 'common' namespace
    },
  };
};

export default Home;
