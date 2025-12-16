import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AgentAuthInterceptor implements HttpInterceptor {
  
  constructor() {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if we have an agent token in local storage
    const agentToken = localStorage.getItem('agent_token');
    
    if (agentToken) {
      // Clone the request and add the authorization header
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${agentToken}`)
      });
      
      return next.handle(authReq);
    }
    
    // If no token, just pass the request through
    return next.handle(request);
  }
}