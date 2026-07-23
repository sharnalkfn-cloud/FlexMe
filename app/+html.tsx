import { ScrollViewStyleReset } from 'expo-router/html';
import React, { type PropsWithChildren } from 'react';

const BACKGROUND_COLOR = '#0A0A14';

/**
 * Root document for the web build. Without this, html/body/#root have no
 * explicit background, so iOS Safari's elastic overscroll (and the
 * address-bar show/hide viewport resize) can reveal a white flash at the
 * edges of the screen even though every in-app screen is already dark.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content={BACKGROUND_COLOR} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                background-color: ${BACKGROUND_COLOR};
                min-height: 100%;
                min-height: 100vh;
                min-height: -webkit-fill-available;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
