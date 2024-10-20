import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import PopulatedNavBar from "../components/PopulatedNavBar";
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  // Pages where the NavBar should not be displayed
  //const noNavBarRoutes = ['/', '/signup']; // Adjust these paths as per your route setup

  // Check if the current path is in the list of paths that should not display the NavBar
  //const showNavBar = !noNavBarRoutes.includes(router.pathname);

  //{showNavBar && <PopulatedNavBar />}
  return (
    <SessionProvider session={session}>
      {<PopulatedNavBar />} 
      <Component {...pageProps} />
    </SessionProvider>
  );
}
export default MyApp;




