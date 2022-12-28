import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { config } from 'src/app/shared/shared.config';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log("err");
            console.log(err);
            let error: string = "";
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }

            if (err.status === 405) {
                error = config.NOTIENEPERMISOS;              
                return throwError(error);
            }

            if (err.status === 400) {
                error = config.NOEXISTERECURSO;
                return throwError(error);
            }

            if (err.status === 500 || !err.ok) {
                error = config.PROBLEMAENELSERVIDOR;             
                return throwError(error);
            }            

            if (err.url == null) {
                error = config.NOHAYCOMUNICACION;
                return throwError(error);
            }           

            error = err.message || err.statusText;
            return throwError(error);
        }));
    }
}
