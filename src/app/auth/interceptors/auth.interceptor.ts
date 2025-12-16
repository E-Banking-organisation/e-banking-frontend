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
    '/api/auth/reset-password'
  ];

  let modifiedReq = req;
  if (isBrowser) {
    const token = localStorage.getItem('token');
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (token && !isPublicEndpoint) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Added Authorization header with token for:', req.url);
    } else {
      console.log('No Authorization header added for:', req.url);
    }
  } else {
    console.log('Running on server, skipping token addition for:', req.url);
  }

  return next(modifiedReq);
};
