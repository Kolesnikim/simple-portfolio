import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ErrorInterceptor} from "./core/interceptors/error/error.interceptor";
import {AccessTokenInterceptor} from "./core/interceptors/access-token/access-token.interceptor";
import {LoaderInterceptor} from "./core/interceptors/loader/loader.interceptor";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {LoaderService} from "./shared/services/loader-service/loader.service";
import {InfoNotificationService} from "./core/services/info-notification/info-notification.service";

export const appConfig: ApplicationConfig = {
  providers: [
    LoaderService,
    InfoNotificationService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes), provideAnimationsAsync()
  ]
};
