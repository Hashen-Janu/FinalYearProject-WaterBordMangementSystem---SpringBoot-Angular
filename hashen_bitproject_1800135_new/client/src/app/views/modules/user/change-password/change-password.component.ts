import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mustMatch} from '../../../../shared/validators/must-match-validator';
import {strongPassword} from '../../../../shared/validators/strong-password-validator';
import {UserService} from '../../../../services/user.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  currentPasswordHide = true;
  newPasswordHide = true;
  newPasswordConfirmHide = true;

  form = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
      strongPassword(8, 25, 8)
    ]),
    newPasswordConfirm: new FormControl('', [
      Validators.required
    ]),
  }, [mustMatch('newPassword', 'newPasswordConfirm')]);

  get currentPasswordField(): FormControl{
    return this.form.controls.currentPassword as FormControl;
  }

  get newPasswordField(): FormControl{
    return this.form.controls.newPassword as FormControl;
  }

  get newPasswordConfirmField(): FormControl{
    return this.form.controls.newPasswordConfirm as FormControl;
  }

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  async submit(): Promise<void> {
    if (this.form.invalid){ return; }

    try{
      await this.userService.changeMyPassword({
        newPassword: this.newPasswordField.value,
        oldPassword: this.currentPasswordField.value,
      });
      await this.router.navigateByUrl('/');
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 400:
          const errors = JSON.parse(e.error.message);
          if (errors.oldPassword){
            this.currentPasswordField.setErrors({notExists: true});
          }
          break;
        default: this.snackBar.open('Something is wrong', 'Error');
      }
    }
  }
}
