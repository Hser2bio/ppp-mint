import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" id="monster-dark-parent-style-css"  href="https://porcupineplaygroundpals.com/wp-content/themes/designexo/style.css" type="text/css" media="all" />
        <link rel="stylesheet" id="monster-dark-child-style-css"  href="https://porcupineplaygroundpals.com/wp-content/themes/ppp-dark/style.css" type="text/css" media="all" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
