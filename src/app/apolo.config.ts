import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

export function apolloProviderFactory() {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri: 'http://localhost:9090/graphql' }),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = provideApollo(apolloProviderFactory);
