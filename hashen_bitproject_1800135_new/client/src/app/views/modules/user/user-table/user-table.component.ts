import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {User, UserDataPage} from '../../../../entities/user';
import {UserService} from '../../../../services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ApiManager} from '../../../../shared/api-manager';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent extends AbstractComponent implements OnInit {

  userDataPage: UserDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  usernameField = new FormControl();
  statusField = new FormControl();
  displayNameField = new FormControl();

  getDisplayName(user: User): string{
    return User.getDisplayName(user);
  }

  get canResetPassword(): boolean{
    return LoggedUser.can(UsecaseList.RESET_USER_PASSWORDS);
  }

  get thumbnailURL(): string{
    return ApiManager.getURL('files/thumbnail/');
  }

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('username', this.usernameField.value);
    pageRequest.addSearchCriteria('userstatus', this.statusField.value);
    pageRequest.addSearchCriteria('displayname', this.displayNameField.value);

    this.userService.getAll(pageRequest).then((page: UserDataPage) => {
      this.userDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_USER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_USERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_USER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_USER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_USER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'username', 'displayname', 'status'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.canResetPassword) { this.displayedColumns.push('reset-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(user: User): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: User.getDisplayName(user)}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.userService.delete(user.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

  resetPassword(user: User): void{
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '350px',
      data: {user}
    });
  }

}
