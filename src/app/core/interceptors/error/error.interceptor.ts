import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InfoNotificationService } from '../../services/info-notification/info-notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private infoNotification: InfoNotificationService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
        if (err.error) {
          const error = err.error;

          if (error.message) {
            this.infoNotification.showNotification(error.message);
            return ErrorInterceptor.throw(error.message, String(err.status));
          }

          if (error.error_description) {
            this.infoNotification.showNotification(error.error_description);
            return this.throwGrantError(error, err.status);
          }

          if (error.error) {
            this.infoNotification.showNotification(error.error);
            return ErrorInterceptor.throw(error.error);
          }
        }

        const message = 'Connection error. Please try again later.';

        this.infoNotification.showNotification(message);
        return ErrorInterceptor.throw(message);
      })
    );
  }

  static throw(message: string, code?: string): Observable<never> {
    const error = new Error(message);
    error.name = code || 'BackendError';
    return throwError(error);
  }

  private throwGrantError(err: any, status: number): Observable<never> {
    if (err.error === 'invalid_grant' && status === 401) {
      this.clearUserData();
    }
    return ErrorInterceptor.throw(err.error_description, String(status));
  }

  private clearUserData(): void {
    sessionStorage.clear();
  }
}
