import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ThemeManager} from '../theme-manager';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.addPanelClass('custom-dialog');
    if (ThemeManager.isDark()) {
      this.dialogRef.addPanelClass('dark');
    } else {
      this.dialogRef.addPanelClass('light');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
