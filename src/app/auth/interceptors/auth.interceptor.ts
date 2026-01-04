import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/verify-code',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/agents/**'
  ];

  let modifiedReq = req;

  if (isBrowser) {
    const token = localStorage.getItem('token');
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    const isGraphQLRequest = req.url.includes('/graphql');

    // ✅ Ajouter le token à TOUTES les requêtes sauf les publiques
    if (token && !isPublicEndpoint) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`✅ Token ajouté pour ${isGraphQLRequest ? 'GraphQL' : 'REST'}:`, req.url);
    } else if (!token && !isPublicEndpoint) {
      console.warn('⚠️ Aucun token disponible pour:', req.url);
    } else if (isPublicEndpoint) {
      console.log('🔓 Endpoint public, pas de token nécessaire:', req.url);
    }
  }

  return next(modifiedReq);
};
