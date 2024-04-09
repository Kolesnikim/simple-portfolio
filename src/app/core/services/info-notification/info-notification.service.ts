import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class InfoNotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  showNotification(message: string) {
    this._snackBar.open(message, 'Cancel');
  }
}
