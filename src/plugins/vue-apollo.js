import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
  createApolloClient,
  restartWebsockets
} from 'vue-cli-plugin-apollo/graphql-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client'

import store from '@/store'
import i18n from '@/plugins/vue-i18n'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  link: onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) _handleGraphQLErrors(graphQLErrors)

    if (networkError) _handleNetworkError(networkError)
  }),
  // Research more about it and define a new structure
  // defaultHttpLink: false,
  httpLinkOptions: {
    httpLink: createUploadLink({
      uri: httpEndpoint
    })
  },

  // Override default cache
  cache: new InMemoryCache({
    addTypename: false
  })

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Create apollo client
export const { apolloClient, wsClient } = createApolloClient({
  ...defaultOptions
})
apolloClient.wsClient = wsClient

// Call this in the Vue app file
export function createProvider() {
  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'network-only'
      }
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    }
  })

  return apolloProvider
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}

function _handleGraphQLErrors(graphQLErrors) {
  graphQLErrors.map(({ message, extensions, locations, path }) =>
    _processGraphQLErrors(message)
  )
}

function _processGraphQLErrors(message) {
  if (message === 'The user credentials were incorrect.') {
    _showError(i18n.t('errors.graph.invalid_credentials'))
  }
}

function _handleNetworkError(networkError) {
  switch (networkError.message) {
    case 'Failed to fetch':
      _showError(i18n.t('errors.network.failed_to_fetch'))
      break
  }
}

function _showError(text) {
  store.dispatch('layout/setSnackbar', {
    show: true,
    y: 'bottom',
    x: 'right',
    timeout: 5000,
    color: 'error',
    text: text
  })
}
