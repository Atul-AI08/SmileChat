import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { messaging } from "@/utils/FirebaseConfig"
import { useEffect } from "react";
import { getToken } from "firebase/messaging";





export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log(messaging)
    getToken(messaging, { vapidKey:"BMrULLQ9L4Pt7PojnXSrXaSln7KjNVhId_25gqR640IZWSxZU9bN_u3xyX9wEgDBMzyahtC-49m22olLs8BSEDo"}).then((currentToken) => {
      console.log(currentToken);
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
     }).catch((err) => {
       console.log('An error occurred while retrieving token. ', err);
       // ...
     });

  }, [])
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Webchat-Pro</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  );
}
