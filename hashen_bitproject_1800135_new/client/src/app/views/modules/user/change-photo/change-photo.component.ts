import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';

@Component({
  selector: 'app-change-photo',
  templateUrl: './change-photo.component.html',
  styleUrls: ['./change-photo.component.scss']
})
export class ChangePhotoComponent implements OnInit {

  user = LoggedUser.user;

  form = new FormGroup({
    photo: new FormControl(),
  });

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.user.photo){
      this.photoField.setValue([this.user.photo]);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    let photo;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){ photo = photoIds[0]; }
    else{ photo = null; }

    try{
      await this.userService.changeMyPhoto(photo);
      window.location.assign('/');
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
