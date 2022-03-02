import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RoleService} from '../../../../services/role.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Role} from '../../../../entities/role';
import {Systemmodule} from '../../../../entities/systemmodule';
import {SystemmoduleService} from '../../../../services/systemmodule.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent extends AbstractComponent implements OnInit {

  systemmodules: Systemmodule[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    usecases: new FormArray([], [
      Validators.required
    ])
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get usecaseField(): FormArray{
    return this.form.controls.usecases as FormArray;
  }

  constructor(
    private roleService: RoleService,
    private systemmoduleService: SystemmoduleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  onUsecaseChange(event: MatSlideToggleChange, id: number): void{

    this.usecaseField.markAsTouched();
    this.usecaseField.markAsDirty();

    if (event.checked) {
      this.usecaseField.push(new FormControl(id));
    } else {
      let i = 0;
      this.usecaseField.controls.forEach((item: FormControl) => {
        if (item.value === id) {
          this.usecaseField.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit(): void {
    this.loadData();

    this.systemmoduleService.getAll().then((data: Systemmodule[]) => {
      this.systemmodules = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROLE);
  }

  async submit(): Promise<void> {
    this.usecaseField.markAsTouched();
    this.usecaseField.markAsDirty();
    if (this.form.invalid) { return; }

    const role: Role = new Role();
    role.name = this.nameField.value;
    role.usecaseList = this.usecaseField.value;

    try{
      const resourceLink: ResourceLink = await this.roleService.add(role);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/roles/' + resourceLink.id);
      } else {
        this.form.reset();
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          if (msg.name){
            this.nameField.setErrors({exists: true});
          }else{
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

}
