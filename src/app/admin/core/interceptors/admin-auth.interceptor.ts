import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {AuthService} from '../../../auth/services/auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const isBrowser = isPlatformBrowser(platformId);

  let modifiedReq = req;
  if (isBrowser) {
    const user = authService.currentUserValue;
    const token = user?.token || localStorage.getItem('token'); // Use 'token'

    // Apply to admin and agent endpoints
    if (token && (req.url.includes('/api/admin') || req.url.includes('/api/agent'))) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Correct syntax
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
