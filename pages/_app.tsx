import 'styles/main.css';
import 'styles/chrome-bug.css';

import { NhostProvider, SignedIn, SignedOut } from '@nhost/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import Layout from 'components/Layout';
import { AppProps } from 'next/app';
import React from 'react';

import { nhost } from '@/utils/nhost';
import { queryClient } from '@/utils/react-query-client';

import SignIn from './signin';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-black">
      <QueryClientProvider client={queryClient}>
        <NhostProvider nhost={nhost}>
          <Layout>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </Layout>
        </NhostProvider>
      </QueryClientProvider>
    </div>
  );
}
