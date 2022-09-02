import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import createEmotionCache from "../utility/createEmotionCache";
import darkThemeOptions from "../styles/theme/darkThemeOptions";
import "../styles/globals.css";
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(darkThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SERVER_URL, // "https://fierce-crag-46127.herokuapp.com/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
  });
  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </CacheProvider>
  );
};

export default MyApp;
