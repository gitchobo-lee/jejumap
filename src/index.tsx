import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();
const client = new ApolloClient({
  uri: "http://mapserviceapi.duckdns.org",
  cache: new InMemoryCache(),
});
root.render(
  <QueryClientProvider client={queryClient}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
