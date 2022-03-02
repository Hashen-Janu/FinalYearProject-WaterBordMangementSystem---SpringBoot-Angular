import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ThemeManager} from '../theme-manager';

@Component({
  selector: 'app-login-time-out-dialog',
  templateUrl: './login-time-out-dialog.component.html',
  styleUrls: ['./login-time-out-dialog.component.scss']
})
export class LoginTimeOutDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginTimeOutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.dialogRef.addPanelClass('custom-dialog');
    if (ThemeManager.isDark()) {
      this.dialogRef.addPanelClass('dark');
    } else {
      this.dialogRef.addPanelClass('light');
    }
  }

}
