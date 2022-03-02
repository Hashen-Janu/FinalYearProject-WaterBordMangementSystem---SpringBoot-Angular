import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Connectiontype} from '../../../../entities/connectiontype';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';
import {ViewChild} from '@angular/core';
import {ConnectionitemSubFormComponent} from './connectionitem-sub-form/connectionitem-sub-form.component';
import {Connectionitem} from '../../../../entities/connectionitem';

@Component({
  selector: 'app-connectiontype-form',
  templateUrl: './connectiontype-form.component.html',
  styleUrls: ['./connectiontype-form.component.scss']
})
export class ConnectiontypeFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(ConnectionitemSubFormComponent) connectionitemSubForm: ConnectionitemSubFormComponent;

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    fee: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),

    secdeposit: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    nonrefdeposit: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    connectionitems: new FormControl(),
  });
  private x: number;

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get feeField(): FormControl{
    return this.form.controls.fee as FormControl;
  }

  get secdepositField(): FormControl{
    return this.form.controls.secdeposit as FormControl;
  }

  get nonrefdepositField(): FormControl{
    return this.form.controls.nonrefdeposit as FormControl;
  }

  get connectionitemsField(): FormControl{
    return this.form.controls.connectionitems as FormControl;
  }

  constructor(
    private connectiontypeService: ConnectiontypeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{
    this.feeField.disable();

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONTYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONTYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONTYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONTYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONTYPE);
  }

  totalCalculation(): void{
    let total = 0;
    if (this.connectionitemsField.value != null && this.connectionitemsField.value !== ''){
      this.connectionitemsField.value.forEach((item: Connectionitem) => {
        total += parseFloat(String(item.item.price * item.qty));
      });
    }


    if (this.secdepositField.value != null && this.secdepositField.value !== ''){
      total += parseFloat(String(this.secdepositField.value));
    }

    if (this.nonrefdepositField.value != null && this.nonrefdepositField.value !== ''){
      total += parseFloat(String(this.nonrefdepositField.value));
    }

    this.feeField.patchValue(total);
    // console.log('ss');
  }


  async submit(): Promise<void> {
    this.connectionitemSubForm.resetForm();
    this.connectionitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const connectiontype: Connectiontype = new Connectiontype();
    connectiontype.name = this.nameField.value;
    connectiontype.fee = this.feeField.value;
    connectiontype.secdeposit = this.secdepositField.value;
    connectiontype.nonrefdeposit = this.nonrefdepositField.value;
    connectiontype.connectionitemList = this.connectionitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.connectiontypeService.add(connectiontype);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connectiontypes/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.fee) { this.feeField.setErrors({server: msg.fee}); knownError = true; }
          if (msg.secdeposit) { this.secdepositField.setErrors({server: msg.secdeposit}); knownError = true; }
          if (msg.nonrefdeposit) { this.nonrefdepositField.setErrors({server: msg.nonrefdeposit}); knownError = true; }
          if (msg.connectionitemList) { this.connectionitemsField.setErrors({server: msg.connectionitemList}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
