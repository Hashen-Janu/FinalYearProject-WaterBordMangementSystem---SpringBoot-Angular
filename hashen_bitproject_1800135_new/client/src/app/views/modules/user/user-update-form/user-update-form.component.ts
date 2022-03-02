import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {User} from '../../../../entities/user';
import {UserService} from '../../../../services/user.service';
import {Role, RoleDataPage} from '../../../../entities/role';
import {RoleService} from '../../../../services/role.service';

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrls: ['./user-update-form.component.scss']
})
export class UserUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  user: User;

  roles: Role[] = [];

  get displayName(): string{
    return User.getDisplayName(this.user);
  }

  form = new FormGroup({
    photo: new FormControl(),
    roles: new FormControl(),
    status: new FormControl()
  });

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get rolesField(): FormControl{
    return this.form.controls.roles as FormControl;
  }

  get statusField(): FormControl{
    return this.form.controls.status as FormControl;
  }

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.roleService.getAllBasic(new PageRequest()).then((page: RoleDataPage) => {
      this.roles = page.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    if (!this.privilege.update){ return; }
    this.user = await this.userService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_USER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_USERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_USER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_USER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_USER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.photoField.pristine) {
      if (this.user.photo) { this.photoField.setValue([this.user.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.rolesField.pristine) {
      const roleIds: number[] = [];
      for (const role of this.user.roleList){
        roleIds.push(role.id);
      }
      this.rolesField.setValue(roleIds);
    }
    if (this.statusField.pristine) {
      this.statusField.setValue(this.user.status);
    }
  }

  async submit(): Promise<void> {
    this.photoField.markAsTouched();
    this.photoField.markAsDirty();
    if (this.form.invalid) { return; }

    const newUser: User = new User();
    newUser.roleList = this.rolesField.value;
    newUser.status = this.statusField.value;

    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newUser.photo = photoIds[0];
    }else{
      newUser.photo = null;
    }

    try{
      const resourceLink: ResourceLink = await this.userService.update(this.selectedId, newUser);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/users/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/users');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 500);
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

}
