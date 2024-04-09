import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';

type Headers = { [key: string]: string };

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = this.setHeaders(req);

    req = req.clone({
      headers: new HttpHeaders(headers),
    });

    return next.handle(req);
  }

  private setHeaders(req: HttpRequest<unknown>): Headers {
    const headers: Headers = {};
    const accessToken = this.storage.getItem('access_token');

    if (accessToken) {
      headers['x-token'] = `ApiKey="${accessToken.replace(/\s/g, '+')}"`;
    }
    return headers;
  }
}
