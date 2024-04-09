import { ComponentRef, DestroyRef, inject, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject, tap } from 'rxjs';
import { scan, map } from 'rxjs/operators';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

@Injectable()
export class LoaderService {
  private apiCount = 0;

  private loader$ = new BehaviorSubject<boolean>(false);
  private loaderTopRef = this.cdkLoaderCreate();

  private spinnerRef?: ComponentRef<MatProgressSpinner>;

  constructor(
    private overlay: Overlay,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.loader$
      .asObservable()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(val => (val ? 1 : -1)),
        scan((acc, one) => (acc + one >= 0 ? acc + one : 0), 0)
      )
      .subscribe(res => {
        if (res === 1) {
          this.showSpinner();
        } else if (res == 0) {
          this.loaderTopRef.hasAttached() ? this.stopSpinner() : null;
        }
      });

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(event => {
          if (event instanceof RouteConfigLoadStart) {
            this.showLoader();
          } else if (event instanceof RouteConfigLoadEnd) {
            this.hideLoader();
          }
        })
      )
      .subscribe();
  }

  showLoader() {
    if (this.apiCount === 0) {
      this.loader$.next(true);
    }
    this.apiCount++;
  }

  hideLoader() {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.loader$.next(false);
    }
  }

  private cdkLoaderCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });
  }

  private showSpinner() {
    if (this.loaderTopRef.hasAttached()) this.stopSpinner();

    this.spinnerRef = this.loaderTopRef.attach(new ComponentPortal(MatProgressSpinner));
    this.spinnerRef.instance.mode = 'indeterminate';
  }

  private stopSpinner() {
    this.loaderTopRef.detach();
  }
}
