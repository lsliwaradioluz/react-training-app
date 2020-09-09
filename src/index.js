import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer from "src/store/reducer"

export const client = new ApolloClient({
  uri:
    process.env.NODE_ENV == "development"
      ? "http://localhost:1337/api/graphql"
      : "https://piti-api.herokuapp.com/api/graphql",
  cache: new InMemoryCache(),
});

const store = createStore(reducer)

const app = (
  <Router>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </Router>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
