// ng g interceptor auth/auth 
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authAPI: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authAPI.getToken();
    const authRequest = request.clone({
      headers: request.headers.set('Authorization', "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
