import { ApolloClient, InMemoryCache, createHttpLink,split } from "@apollo/client";
// import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

const httpLink = new createHttpLink({
  uri: 'https://shrieking-alien-62479-c8880a5b9ebb.herokuapp.com/graphql',
});

//Setting context that resolvers use
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  var token = "";
  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('jwtToken');
  }
  
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const wsLink = 
typeof window !== "undefined"
? new GraphQLWsLink(createClient({
  url: 'wss://shrieking-alien-62479-c8880a5b9ebb.herokuapp.com/graphql/subscriptions',
})):null;
// wss://shrieking-alien-62479-c8880a5b9ebb.herokuapp.com
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = typeof window !== "undefined" && wsLink != null
?split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
):httpLink;

const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
});

export default client;