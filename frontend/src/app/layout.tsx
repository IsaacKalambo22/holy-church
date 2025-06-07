import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';
import StoreProvider from '@/state/redux';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

const ibmPlexSans = localFont({
  src: [
    {
      path: '/fonts/IBMPlexSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/IBMPlexSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/fonts/IBMPlexSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '/fonts/IBMPlexSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

const bebasNeue = localFont({
  src: [
    {
      path: '/fonts/BebasNeue-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--bebas-neue',
});

export const metadata: Metadata = {
  title: 'Holy Church Assembly',
  description: 'Holy Church Assembly: A beacon of faith, community, and spiritual growth.',
};

const RootLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <html lang='en'>
          <head>
            {/* Geography Meta Tags */}
            <meta
              name='geo.region'
              content='US'
            />
            <meta
              name='geo.placename'
              content='Global'
            />
            {/* Canonical URL */}
            <link
              rel='canonical'
              href='https://holychurch.com'
            />
            <link
              rel='icon'
              href='/favicon.ico'
            />
            {/* Open Graph Meta Tags */}
            <meta
              property='og:title'
              content='Holy Church Assembly | A Beacon of Faith and Community'
            />
            <meta
              property='og:description'
              content='A global community dedicated to spiritual growth, community building, and positive impact.'
            />
            <meta
              property='og:url'
              content='https://holychurch.com'
            />
            <meta
              property='og:image'
              content='https://holychurch.com/assets/images/logo.png'
            />
            <meta
              property='og:type'
              content='website'
            />
            <meta
              property='og:site_name'
              content='Holy Church Assembly'
            />
            {/* Twitter Card Meta Tags */}
            <meta
              name='twitter:card'
              content='summary_large_image'
            />
            <meta
              name='twitter:title'
              content='Holy Church Assembly | A Beacon of Faith and Community'
            />
            <meta
              name='twitter:description'
              content='A global community dedicated to spiritual growth, community building, and positive impact.'
            />
            <meta
              name='twitter:image'
              content='https://holychurch.com/assets/images/og-image.png'
            />
            <meta
              name='twitter:site'
              content='@HolyChurchAssembly'
            />
            <meta
              name='twitter:creator'
              content='@HolyChurchAssembly'
            />
          </head>
          <body
            className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
          >
            <div className='main'>
              <div className='gradient' />
            </div>
            <main>{children}</main>
            <Toaster />
          </body>
        </html>
      </StoreProvider>
    </SessionProvider>
  );
};

export default RootLayout;
