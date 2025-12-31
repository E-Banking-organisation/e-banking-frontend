import { TestBed } from '@angular/core/testing';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export function setupApolloTestingModule(): void {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      provideApollo(() => {
        const httpLink = TestBed.inject(HttpLink);
        return {
          link: httpLink.create({ uri: 'http://localhost:8080/graphql' }),
          cache: new InMemoryCache()
        };
      })
    ]
  });
}
