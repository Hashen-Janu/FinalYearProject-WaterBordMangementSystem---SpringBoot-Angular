import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Consumer} from '../../../../entities/consumer';
import {ConsumerService} from '../../../../services/consumer.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {Consumertype} from '../../../../entities/consumertype';
import {GenderService} from '../../../../services/gender.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {ConsumertypeService} from '../../../../services/consumertype.service';

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss']
})
export class ConsumerFormComponent extends AbstractComponent implements OnInit {

  consumertypes: Consumertype[] = [];
  nametitles: Nametitle[] = [];
  genders: Gender[] = [];

  form = new FormGroup({
    consumertype: new FormControl(null, [
      Validators.required,
    ]),
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    firstname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$')
    ]),
    companyname: new FormControl(null, [


    ]),
    designation: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$')
    ]),
    lastname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$')
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[VvXx]))$'),
    ]),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    contact1: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^(?:0)?(7(0|1|2|5|6|7|8)[0-9])[0-9]{6}$'),
      // Validators.pattern('^([0][0-9]{9})$'),
    ]),
    contact2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(1000),
    ]),
    landdeedno: new FormControl(null, [
      Validators.required,
      Validators.pattern('^([a-zA-Z]{1})\/([0-9]{3})\/([0-9]{3})$'),
      Validators.minLength(9),
      Validators.maxLength(10),
    ]),
    landdeedphoto: new FormControl(),

    grcphoto: new FormControl(),
    doregisterd: new FormControl(),



    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get companynameField(): FormControl{
    return this.form.controls.companyname as FormControl;
  }
  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }
  get consumertypeField(): FormControl{
    return this.form.controls.consumertype as FormControl;
  }

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get firstnameField(): FormControl{
    return this.form.controls.firstname as FormControl;
  }

  get lastnameField(): FormControl{
    return this.form.controls.lastname as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }
  get doregisterdField(): FormControl{
    return this.form.controls.doregisterd as FormControl;
  }
  get landdeednoField(): FormControl{
    return this.form.controls.landdeedno as FormControl;
  }
  get landdeedphotoField(): FormControl{
    return this.form.controls.landdeedphoto as FormControl;
  }
  get grcphotoField(): FormControl{
    return this.form.controls.grcphoto as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumertypeService: ConsumertypeService,
    private nametitleService: NametitleService,
    private genderService: GenderService,
    private consumerService: ConsumerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.consumertypeService.getAll().then((consumertypes) => {
      this.consumertypes = consumertypes;
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMER);
  }

  async submit(): Promise<void> {
    this.landdeedphotoField.updateValueAndValidity();
    this.landdeedphotoField.markAsTouched();
    this.grcphotoField.updateValueAndValidity();
    this.grcphotoField.markAsTouched();
    if (this.form.invalid) { return; }

    const consumer: Consumer = new Consumer();
    consumer.consumertype = this.consumertypeField.value;
    consumer.companyname = this.companynameField.value;
    consumer.designation = this.designationField.value;
    consumer.nametitle = this.nametitleField.value;
    consumer.firstname = this.firstnameField.value;
    consumer.lastname = this.lastnameField.value;
    consumer.nic = this.nicField.value;
    consumer.doregisterd = this.doregisterdField.value;
    consumer.gender = this.genderField.value;
    consumer.contact1 = this.contact1Field.value;
    consumer.contact2 = this.contact2Field.value;
    consumer.fax = this.faxField.value;
    consumer.email = this.emailField.value;
    consumer.address = this.addressField.value;
    consumer.landdeedno = this.landdeednoField.value;
    const landdeedphotoIds = this.landdeedphotoField.value;
    if (landdeedphotoIds !== null && landdeedphotoIds !== []){
      consumer.landdeedphoto = landdeedphotoIds[0];
    }else{
      consumer.landdeedphoto = null;
    }

    const grcphotoIds = this.grcphotoField.value;
    if (grcphotoIds !== null && grcphotoIds !== []){
      consumer.grcphoto = grcphotoIds[0];
    }else{
      consumer.grcphoto = null;
    }

    consumer.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumerService.add(consumer);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumers/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.consumertype) { this.consumertypeField.setErrors({server: msg.consumertype}); knownError = true; }
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.firstname) { this.firstnameField.setErrors({server: msg.firstname}); knownError = true; }
          if (msg.lastname) { this.lastnameField.setErrors({server: msg.lastname}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.contact1) { this.contact1Field.setErrors({server: msg.contact1}); knownError = true; }
          if (msg.contact2) { this.contact2Field.setErrors({server: msg.contact2}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.email) { this.doregisterdField.setErrors({server: msg.doregisterdField}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.landdeedphoto) { this.landdeedphotoField.setErrors({server: msg.landdeedphoto}); knownError = true; }
          if (msg.grcphoto) { this.grcphotoField.setErrors({server: msg.grcphoto}); knownError = true; }
          if (msg.landdeedno) { this.landdeednoField.setErrors({server: msg.landdeedno}); knownError = true; }
          if (msg.companyname) { this.companynameField.setErrors({server: msg.companyname}); knownError = true; }
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }

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

  maxdate(): any {
    return new Date();
  }
  validationupdate(): void{
    if (this.consumertypeField.value === 2){
      this.companynameField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-Z ]{3,}$')
        ]);
      this.designationField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(255),
        Validators.pattern('^[a-zA-Z ]{3,}$')
      ]);
      this.companynameField.updateValueAndValidity();
      this.designationField.updateValueAndValidity();
    }else {
      this.companynameField.setValidators([

      ]);
      this.designationField.setValidators([

      ]);
      this.companynameField.updateValueAndValidity();
      this.designationField.updateValueAndValidity();

    }
  }
}
