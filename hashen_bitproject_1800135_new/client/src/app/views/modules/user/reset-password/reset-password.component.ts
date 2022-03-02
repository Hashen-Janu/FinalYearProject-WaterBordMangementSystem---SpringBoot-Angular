import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ThemeManager} from '../../../../shared/views/theme-manager';
import {User} from '../../../../entities/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mustMatch} from '../../../../shared/validators/must-match-validator';
import {strongPassword} from '../../../../shared/validators/strong-password-validator';
import {PasswordGenerator} from '../../../../shared/password-generator';
import {UserService} from '../../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  user: User = null;

  form = new FormGroup({
    password: new FormControl(null,[
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
      strongPassword(8, 25, 8)
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required
    ]),
  }, [mustMatch('password', 'passwordConfirm')]);
  passwordHide = false;
  passwordConfirmHide = false;

  get passwordField(): FormControl{
    return this.form.controls.password as FormControl;
  }

  get passwordConfirmField(): FormControl{
    return this.form.controls.passwordConfirm as FormControl;
  }

  get displayName(): string{
    return User.getDisplayName(this.user);
  }

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

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

  generatePassword(): void{
    const password = PasswordGenerator.generate();
    this.passwordField.setValue(password);
    this.passwordConfirmField.setValue(password);
    this.passwordHide = false;
    this.passwordConfirmHide = false;
  }

  async submit(): Promise<void>{
    if (this.form.invalid){ return; }

    try{
      await this.userService.resetPassword(this.user.id, this.passwordField.value);
      this.snackBar.open('Password reset successfully', null, {duration: 3000});
      this.dialogRef.close();
    }catch (e) {
      this.snackBar.open('Something is wrong', null, {duration: 4000});
    }
  }

}
