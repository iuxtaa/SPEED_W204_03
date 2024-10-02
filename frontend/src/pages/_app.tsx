// src/pages/_app.tsx

import "../styles/globals.scss"; 
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"; 
import { useRouter } from "next/router"; 

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  
  const noNavBarRoutes = ['/', '/signup']; 

  
  const showNavBar = !noNavBarRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {}
      {}

      {}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;


