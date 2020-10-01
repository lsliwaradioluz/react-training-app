import Cookies from "js-cookie";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat
} from "@apollo/client";

const token = Cookies.get("piti-token");
const pathname = window.location.pathname

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:1337/api/graphql"
      : "https://piti-api.herokuapp.com/api/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
      login: pathname === "/login" ? true : false,
    }
  })

  return forward(operation)
})

export default new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});