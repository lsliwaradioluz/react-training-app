import Cookies from "js-cookie";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat
} from "@apollo/client";

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:1337/api/graphql"
      : "https://piti-api.herokuapp.com/api/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${Cookies.get("piti-token")}` || null
    }
  })

  return forward(operation)
})

export default new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});