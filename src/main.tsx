import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('VITE_GOOGLE_CLIENT_ID is not defined');
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
