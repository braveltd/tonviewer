import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <div style={{ display: 'none' }}>
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
