//@ts-nocheck
import * as React from 'react';
import "@/styles/globals.css";
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import ligthTheme from '../styles/theme/lightTheme';
import createEmotionCache from '../util/createEmotionCache';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apollo-client";
import ClientOnly from "../components/ClientOnly";
import {AuthProvider} from '../context/auth';
import AuthRoute from '../util/AuthRoute';
import { SubscriptionProvider } from '../context/SubscriptionProvider.js';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


export default function MyApp(props) {
  const router = useRouter();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Define an array of page paths where you want to exclude the Layout
  const excludedPages = ['/','/login', '/register','/testUpload','/testDelete', '/404'];

  // Check if the current page is in the excludedPages array
  const excludeLayout = excludedPages.includes(router.pathname);
  
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={ligthTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {excludeLayout ? (
              // Render content without Layout
              <ClientOnly>
                {/* <AuthRoute component={Component} {...pageProps} /> */}
                <Component {...pageProps}/>
              </ClientOnly>
            ) : (
              // Render content with Layout
              <ClientOnly>
                <SubscriptionProvider>
                <Layout>
                <AuthRoute component={Component} {...pageProps} />
                {/* <Component {...pageProps}/> */}
                </Layout>
                </SubscriptionProvider>
              </ClientOnly>
            )}
          </ThemeProvider>
        </CacheProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

// export default function MyApp(props: MyAppProps) {
//   const router = useRouter();
//   const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

//   // Define an array of page paths where you want to exclude the Layout
//   const excludedPages = ['/login'];

//   // Check if the current page is in the excludedPages array
//   const excludeLayout = excludedPages.includes(router.pathname);

//   return (
    
//     <CacheProvider value={emotionCache}>
//       <Head>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <ThemeProvider theme={ligthTheme}>
//         {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//         <CssBaseline />
//         {excludeLayout ? (
//           // Render content without Layout
//           <Component {...pageProps} />
//         ) : (
//           // Render content with Layout
//           <Layout>
//             <Component {...pageProps} />
//           </Layout>
//         )}
//       </ThemeProvider>
//     </CacheProvider>
    
//   );
// }