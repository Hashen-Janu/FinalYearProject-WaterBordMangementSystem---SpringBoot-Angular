import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {DateHelper} from '../../../../shared/date-helper';
import {Designation} from '../../../../entities/designation';
import {GenderService} from '../../../../services/gender.service';
import {Employeestatus} from '../../../../entities/employeestatus';
import {NametitleService} from '../../../../services/nametitle.service';
import {DesignationService} from '../../../../services/designation.service';
import {EmployeestatusService} from '../../../../services/employeestatus.service';
import {Unit} from '../../../../entities/unit';
import {UnitService} from '../../../../services/unit.service';

@Component({
  selector: 'app-employee-update-form',
  templateUrl: './employee-update-form.component.html',
  styleUrls: ['./employee-update-form.component.scss']
})
export class EmployeeUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  employee: Employee;

  nametitles: Nametitle[] = [];
  genders: Gender[] = [];
  units: Unit[] = [];
  designations: Designation[] = [];
  employeestatuses: Employeestatus[] = [];

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$')
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$')
    ]),
    dobirth: new FormControl(null, [
      Validators.required,
    ]),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    photo: new FormControl(),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    designation: new FormControl(null, [
      Validators.required,
    ]),
    dorecruit: new FormControl(null, [
      Validators.required,
    ]),
    employeestatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    unit: new FormControl(null, [
      Validators.required,
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
  }

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }

  get dorecruitField(): FormControl{
    return this.form.controls.dorecruit as FormControl;
  }

  get employeestatusField(): FormControl{
    return this.form.controls.employeestatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }


  constructor(
    private nametitleService: NametitleService,
    private genderService: GenderService,
    private designationService: DesignationService,
    private employeestatusService: EmployeestatusService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private unitService: UnitService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.designationService.getAll().then((designations) => {
      this.designations = designations;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeestatusService.getAll().then((employeestatuses) => {
      this.employeestatuses = employeestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.unitService.getAll().then((units) => {
      this.units = units;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employee = await this.employeeService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EMPLOYEE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.employee.nametitle.id);
    }
    if (this.unitField.pristine) {
      this.unitField.setValue(this.employee.unit.id);
    }
    if (this.callingnameField.pristine) {
      this.callingnameField.setValue(this.employee.callingname);
    }
    if (this.fullnameField.pristine) {
      this.fullnameField.setValue(this.employee.fullname);
    }
    if (this.dobirthField.pristine) {
      this.dobirthField.setValue(this.employee.dobirth);
    }
    if (this.genderField.pristine) {
      this.genderField.setValue(this.employee.gender.id);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.employee.nic);
    }
    if (this.photoField.pristine) {
      if (this.employee.photo) { this.photoField.setValue([this.employee.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.employee.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.employee.land);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.employee.email);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.employee.address);
    }
    if (this.designationField.pristine) {
      this.designationField.setValue(this.employee.designation.id);
    }
    if (this.dorecruitField.pristine) {
      this.dorecruitField.setValue(this.employee.dorecruit);
    }
    if (this.employeestatusField.pristine) {
      this.employeestatusField.setValue(this.employee.employeestatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.employee.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newemployee: Employee = new Employee();
    newemployee.nametitle = this.nametitleField.value;
    newemployee.callingname = this.callingnameField.value;
    newemployee.fullname = this.fullnameField.value;
    newemployee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    newemployee.gender = this.genderField.value;
    newemployee.nic = this.nicField.value;
    newemployee.unit = this.unitField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newemployee.photo = photoIds[0];
    }else{
      newemployee.photo = null;
    }
    newemployee.mobile = this.mobileField.value;
    newemployee.land = this.landField.value;
    newemployee.email = this.emailField.value;
    newemployee.address = this.addressField.value;
    newemployee.designation = this.designationField.value;
    newemployee.dorecruit = DateHelper.getDateAsString(this.dorecruitField.value);
    newemployee.employeestatus = this.employeestatusField.value;
    newemployee.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.employeeService.update(this.selectedId, newemployee);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/employees/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/employees');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.callingname) { this.callingnameField.setErrors({server: msg.callingname}); knownError = true; }
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.dobirth) { this.dobirthField.setErrors({server: msg.dobirth}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }
          if (msg.dorecruit) { this.dorecruitField.setErrors({server: msg.dorecruit}); knownError = true; }
          if (msg.employeestatus) { this.employeestatusField.setErrors({server: msg.employeestatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
  setGender(): void {
    if (this.nametitleField.value === 1){
      if (this.genderField.pristine) {
        this.genderField.setValue(1);
      }
    }
    if (this.nametitleField.value === 2){
      if (this.genderField.pristine) {
        this.genderField.setValue(2);
      }
    }

    if (this.nametitleField.value === 3){
      if (this.genderField.pristine) {
        this.genderField.setValue(2);
      }
    }
  }

  Maxdate(): any {
    return new Date();
  }
}
