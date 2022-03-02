import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Connectiontype} from '../../../../entities/connectiontype';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';
import {ViewChild} from '@angular/core';
import {ConnectionitemUpdateSubFormComponent} from './connectionitem-update-sub-form/connectionitem-update-sub-form.component';
import {Connectionitem} from '../../../../entities/connectionitem';

@Component({
  selector: 'app-connectiontype-update-form',
  templateUrl: './connectiontype-update-form.component.html',
  styleUrls: ['./connectiontype-update-form.component.scss']
})
export class ConnectiontypeUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  connectiontype: Connectiontype;

  @ViewChild(ConnectionitemUpdateSubFormComponent) connectionitemUpdateSubForm: ConnectionitemUpdateSubFormComponent;

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
    value: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    connectionitems: new FormControl(),
  });

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
  get valueField(): FormControl{
    return this.form.controls.value as FormControl;
  }

  get connectionitemsField(): FormControl{
    return this.form.controls.connectionitems as FormControl;
  }

  constructor(
    private connectiontypeService: ConnectiontypeService,
    private route: ActivatedRoute,
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

    this.connectiontype = await this.connectiontypeService.get(this.selectedId);
    this.setValues();
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


  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.connectiontype.name);
    }
    if (this.feeField.pristine) {
      this.feeField.setValue(this.connectiontype.fee);
    }
    if (this.secdepositField.pristine) {
      this.secdepositField.setValue(this.connectiontype.secdeposit);
    }
    if (this.nonrefdepositField.pristine) {
      this.nonrefdepositField.setValue(this.connectiontype.nonrefdeposit);
    }
    if (this.valueField.pristine) {
      this.valueField.setValue(this.connectiontype.nonrefdeposit);
    }
    if (this.connectionitemsField.pristine) {
      this.connectionitemsField.setValue(this.connectiontype.connectionitemList);
    }
}

  async submit(): Promise<void> {
    this.connectionitemUpdateSubForm.resetForm();
    this.connectionitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newconnectiontype: Connectiontype = new Connectiontype();
    newconnectiontype.name = this.nameField.value;
    newconnectiontype.fee = this.feeField.value;
    newconnectiontype.secdeposit = this.secdepositField.value;
    newconnectiontype.nonrefdeposit = this.nonrefdepositField.value;
    newconnectiontype.value = this.valueField.value;
    newconnectiontype.connectionitemList = this.connectionitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.connectiontypeService.update(this.selectedId, newconnectiontype);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connectiontypes/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/connectiontypes');
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
          if (msg.value) { this.valueField.setErrors({server: msg.value}); knownError = true; }
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
