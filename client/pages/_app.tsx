import React from 'react';
import { appWithTranslation } from 'next-i18next';
import '../i18n';

const MyApp = ({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) => {
  return <Component {...pageProps} />;};

// Wrap the whole app with appWithTranslation
export default appWithTranslation(MyApp);
