import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  public constructor(private _snackBar: MatSnackBar) { }

  public showAlert(status: string, message: string) {
    // alert(status + '::::' + message);
    let cssClass = "none";
    if (status == 'warn') {
      cssClass = "snackbar-warn";
    }
    if (status == 'error') {
      cssClass = "snackbar-error";
    }
    if (status == 'success') {
      cssClass = "snackbar-success";
    }
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [cssClass]
    });
  }
}
