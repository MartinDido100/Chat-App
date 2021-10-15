import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cS: CookieService,private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let req = request;

    const token = this.cS.get('token');

    if(token){
      req = request.clone({
        setHeaders: {
          autorizathion: `Bearer ${token}`
        }
      })
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401){
          this.router.navigateByUrl('/auth/login');
        }
        return throwError(err);
      })
    );
  }
}
