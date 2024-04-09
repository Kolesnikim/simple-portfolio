import { Injectable } from '@angular/core';
import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../../../shared/services/loader-service/loader.service';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(SkipLoading)) {
      return next.handle(req);
    }

    this.loader.showLoader();

    return next.handle(req).pipe(
      finalize(() => {
        this.loader.hideLoader();
      })
    );
  }
}
