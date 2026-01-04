import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts } from 'ng2-charts';
import { provideApollo, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { APOLLO_NAMED_OPTIONS } from 'apollo-angular';

import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideCharts(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Client Apollo par défaut (pour l'audit - désactivé pour l'instant)
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({
          uri: 'http://localhost:8080/graphql'
        }),
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
    }),


    // Clients Apollo nommés (crypto et ai)
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: (httpLink: HttpLink): NamedOptions => {
        return {
          crypto: {
            link: httpLink.create({ uri: environment.cryptoUrl }) as unknown as ApolloLink,
            cache: new InMemoryCache(),
            defaultOptions: {
              watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              mutate: { errorPolicy: 'all' }
            }
          },
          ai: {
            link: httpLink.create({ uri: environment.aiUrl }) as unknown as ApolloLink,
            cache: new InMemoryCache(),
            defaultOptions: {
              watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              mutate: { errorPolicy: 'all' }
            }
          },
          analytics: {
            link: httpLink.create({ uri: environment.graphqlUrl }) as unknown as ApolloLink,
            cache: new InMemoryCache(),
            defaultOptions: {
              watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
              mutate: { errorPolicy: 'all' }
            }
          }
        };
      },
      deps: [HttpLink]
    }
  ]
};
