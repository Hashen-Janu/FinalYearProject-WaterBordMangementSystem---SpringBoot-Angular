import { Component, OnInit } from '@angular/core';
import {User} from '../../../../entities/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends AbstractComponent implements OnInit {

  user: User;
  selectedId: number;
  photo: string = null;

  get displayName(): string{
    return User.getDisplayName(this.user);
  }

  get canResetPassword(): boolean{
    return LoggedUser.can(UsecaseList.RESET_USER_PASSWORDS);
  }

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: User.getDisplayName(this.user)}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.userService.delete(this.user.id);
        await this.router.navigateByUrl('/users');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.user = await this.userService.get(this.selectedId);
    if (this.user.photo == null){
      this.photo = null;
    }else {
      const photoObject = await this.userService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_USER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_USERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_USER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_USER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_USER);
  }

  resetPassword(): void{
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '350px',
      data: {user: this.user}
    });
  }

}
