import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
if (!backendUrl) {
  throw new Error(
    "[apollo] VITE_BACKEND_URL não definida. Preencha o arquivo .env com VITE_BACKEND_URL=<url da API>."
  );
}

const httpLink = new HttpLink({
  uri: backendUrl,
});

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
