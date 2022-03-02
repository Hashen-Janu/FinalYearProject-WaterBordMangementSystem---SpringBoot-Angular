import { Component, OnInit } from '@angular/core';
import {TokenManager} from '../../shared/security/token-manager';
import {ConfigurationService} from '../../shared/configuration.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ThemeManager} from '../../shared/views/theme-manager';
import {User} from '../../entities/user';
import {strongPassword} from '../../shared/validators/strong-password-validator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {mustMatch} from '../../shared/validators/must-match-validator';

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-configuration.component.html',
  styleUrls: ['./admin-configuration.component.scss']
})
export class AdminConfigurationComponent implements OnInit {

  isDark = ThemeManager.isDark();
  passwordHide = true;
  passwordConfirmHide = true;

  form: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
      strongPassword(8, 25, 8)
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required
    ]),
  }, [mustMatch('password', 'passwordConfirm')]);

  get passwordField(): FormControl{
    return this.form.controls.password as FormControl;
  }

  get passwordConfirmField(): FormControl{
    return this.form.controls.passwordConfirm as FormControl;
  }

  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async submit(): Promise<void>{
    if (this.form.invalid) { return; }

    const user: User = new User();
    user.username = 'Administrator';
    user.password = this.passwordField.value;

    try{
      const clientToken = await this.configurationService.config(user);

      TokenManager.setToken(clientToken);
      window.location.assign('/');
    }catch (e) {
      switch (e.status) {
        case 400:
        case 423: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        default: this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

}
