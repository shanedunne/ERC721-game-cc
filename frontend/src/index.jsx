import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Buffer } from "buffer";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

window.Buffer = Buffer;

export const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/100759/level_up_data/version/latest',
  cache: new InMemoryCache(),
});

console.log("Rendering React app...");


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
