/** @type {import('next').NextConfig} */
import withLinaria from 'next-with-linaria';
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(({ config }) => config());
}

const getBotNameByDomain = domain => {
  switch (domain) {
    case 'tonapi.io':
      return 'tonapi_auth_bot';
    case 'testnet.tonapi.io':
      return 'tonapi_auth_testnet_bot';
    case 'dev.tonapi.io':
    default:
      return 'tonapi_auth_dev_bot';
  }
};

export default withLinaria({
  reactStrictMode: true,
  swcMinify: false,
  env: {
    hostName: process.env.HOST_NAME,
    host: `https://${process.env.HOST_NAME}`,
    exchangeHost: 'https://data2.ton.app/stock',
    authBotName: getBotNameByDomain(process.env.HOST_NAME),
    tonApiToken: process.env.TON_API_TOKEN,
    isTestOnly: process.env.IS_TEST_ONLY === 'true',
    authClientToken: process.env.AUTH_TOKEN_CLIENT,
    authServerToken: process.env.AUTH_TOKEN_SSR
  },
  images: {
    domains: ['robohash.org', 't.me']
  },
  // Append the default value with md extensions
  pageExtensions: ['page.ts', 'page.tsx'],
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true
  },
  distDir: 'build'
});
