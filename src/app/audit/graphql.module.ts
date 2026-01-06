import { NgModule } from '@angular/core';
import { APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions, ApolloLink } from '@apollo/client/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from '../auth/interceptors/auth.interceptor';
import { environment } from '../../environments/environment';

// URL du client par défaut (audit)
const defaultUri = 'http://localhost:8086/graphql';


export function createApollo(httpLink: HttpLink): ApolloClientOptions {
  const http = httpLink.create({ uri: defaultUri });

  return {
    link: http as unknown as ApolloLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  };
}

// Factory pour les clients nommés (crypto et ai)
export function createNamedApollo(httpLink: HttpLink): NamedOptions {
  return {
    crypto: {
      link: httpLink.create({ uri: environment.cryptoUrl }) as unknown as ApolloLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      }
    },
    ai: {
      link: httpLink.create({ uri: environment.aiUrl }) as unknown as ApolloLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      }
    }
  };
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: createNamedApollo,
      deps: [HttpLink]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authInterceptor,
      multi: true
    }
  ]
})
export class GraphQLModule { }