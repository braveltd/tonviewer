import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { css } from '@linaria/core';
import Head from 'next/head';
import Script from 'next/script';
import useDarkMode from 'use-dark-mode';
import { themes } from '../styles/ThemeConfig';
import { TonApiErrorBoundary } from '../components';
import { Header } from 'tonviewer-web/components/layout/Header';
import { Footer } from 'tonviewer-web/components/layout/Footer';
import { App } from '../components/core/app';
import { BottomSheetContainer, BottomSheetContext } from 'src/components/bottom-sheet/Bottom-sheet';
import GoogleAnalytics from '@bradgarropy/next-google-analytics';
import { DialogProvider } from 'tonviewer-web/components/provider/DialogProvider';

import '../styles/globals.css';

const mainContainer = css`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

export const MobileMenu = () => {
  const { component: Component } = useContext(BottomSheetContext);
  return <BottomSheetContainer childern={Component} />;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    darkmode: boolean;
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const darkmode = useDarkMode();
  const theme = themes[darkmode.value ? 'dark' : 'light'];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme.colors.background.card);
  }, [theme]);

  useEffect(() => {
    if (isMounted) {
      if (typeof window !== 'undefined') {
        if (!darkmode.value && window.darkmode) {
          darkmode.toggle();
        }
      }
    }
  }, [isMounted]);

  return (
    <App theme={theme}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1D2633" />
        <title>Tonviewer</title>
      </Head>
      <div className={mainContainer}>
        <DialogProvider>
          <MobileMenu />
          {isMounted && (
            <TonApiErrorBoundary>
              <Header />
              <Component {...pageProps} key={router.asPath} />
              <Footer />
              <div style={{ display: 'none' }}>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-BHFS4Y03ML" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-BHFS4Y03ML');
                  `}
                </Script>
                <GoogleAnalytics measurementId={'G-BHFS4Y03ML'} />
              </div>
            </TonApiErrorBoundary>
          )}
        </DialogProvider>
      </div>
    </App>
  );
}

export default MyApp;
