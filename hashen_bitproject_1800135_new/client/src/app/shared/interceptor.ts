import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {TokenManager} from './security/token-manager';
import {ClientToken} from './client-token';
import { map, catchError } from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {LoginTimeOutDialogComponent} from './views/login-time-out-dialog/login-time-out-dialog.component';
import {Router} from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor{

  private static isTimeOutDialogOpen = false;

  constructor(private dialog: MatDialog, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const clientToken: ClientToken =  TokenManager.getToken();
    if (clientToken === null) { return next.handle(req); }

    req = req.clone({
      setHeaders: {
        Authorization: clientToken.text
      }
    });



    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        if (!Interceptor.isTimeOutDialogOpen && error.status === 401){

          Interceptor.isTimeOutDialogOpen = true;
          TokenManager.destroyToken();

          const dialogRef = this.dialog.open(LoginTimeOutDialogComponent, {
            width: '300px'
          });

          setTimeout(() => {
            dialogRef.close();
          }, 5000);

          dialogRef.afterClosed().subscribe( async result => {
            Interceptor.isTimeOutDialogOpen = false;
            await this.router.navigateByUrl('/login');
          });
        }
        return throwError(error);
      })
    );
  }
}
