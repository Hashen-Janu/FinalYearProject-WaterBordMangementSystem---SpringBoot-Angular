import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Role} from '../../../../entities/role';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Systemmodule} from '../../../../entities/systemmodule';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RoleService} from '../../../../services/role.service';
import {SystemmoduleService} from '../../../../services/systemmodule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {ResourceLink} from '../../../../shared/resource-link';

@Component({
  selector: 'app-role-update-form',
  templateUrl: './role-update-form.component.html',
  styleUrls: ['./role-update-form.component.scss']
})
export class RoleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  role: Role;

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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.systemmoduleService.getAll().then((data: Systemmodule[]) => {
      this.systemmodules = data;
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

    this.role = await this.roleService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) { this.nameField.patchValue(this.role.name); }
    if (this.usecaseField.pristine) {
      for (const usecase of this.role.usecaseList){
        this.usecaseField.push(new FormControl(usecase.id));
      }
    }
  }


  isSelectedUsecase(id: number): boolean{
    const selectedIds = this.usecaseField.value;
    let selected = false;

    for (const selectedId of selectedIds){
      if (selectedId === id){
        selected = true;
        break;
      }
    }

    return selected;
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

  async submit(): Promise<void> {
    this.usecaseField.markAsTouched();
    this.usecaseField.markAsDirty();
    if (this.form.invalid) { return; }

    const newRole: Role = new Role();
    newRole.name = this.nameField.value;
    newRole.usecaseList = this.usecaseField.value;

    try{
      const resourceLink: ResourceLink = await this.roleService.update(this.selectedId, newRole);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/roles/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/roles');
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
