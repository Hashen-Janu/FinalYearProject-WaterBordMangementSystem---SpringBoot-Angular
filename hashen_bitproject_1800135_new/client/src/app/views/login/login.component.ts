import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginRequest} from '../../shared/login-request';
import {AuthenticationService} from '../../shared/authentication.service';
import {TokenManager} from '../../shared/security/token-manager';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {ThemeManager} from '../../shared/views/theme-manager';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  responseMsg: string;
  isDark = ThemeManager.isDark();

  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true),
  });

  get usernameField(): FormControl{
    return this.form.controls.username as FormControl;
  }

  get passwordField(): FormControl{
    return this.form.controls.password as FormControl;
  }

  get rememberMeField(): FormControl{
    return this.form.controls.rememberMe as FormControl;
  }

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    if (TokenManager.isContainsToken()){
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {}

  async submit(): Promise<void>{
    if (this.form.invalid) { return; }

    const loginRequest = new LoginRequest();
    loginRequest.username = this.usernameField.value.trim();
    loginRequest.password = this.passwordField.value.trim();
    loginRequest.rememberMe = this.rememberMeField.value;

    try{
      const clientToken = await this.authenticationService.getToken(loginRequest);
      this.responseMsg = null;

      TokenManager.setToken(clientToken);
      await this.router.navigateByUrl('/');
    }catch (e) {
      this.passwordField.setValue('');
      switch (e.status) {
        case 401: this.responseMsg = 'Invalid credentials. Please try again'; break;
        case 423: this.responseMsg = e.error.message; break;
        default: this.responseMsg = 'Something is wrong';
      }
    }
  }

}
