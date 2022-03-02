import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Connectionrequest} from '../../../../entities/connectionrequest';
import {ConnectionrequestService} from '../../../../services/connectionrequest.service';
import {ViewChild} from '@angular/core';
import {Consumer} from '../../../../entities/consumer';
import {Discount} from '../../../../entities/discount';
import {Placetype} from '../../../../entities/placetype';
import {Ownershiptype} from '../../../../entities/ownershiptype';
import {Connectiontype} from '../../../../entities/connectiontype';
import {ConsumerService} from '../../../../services/consumer.service';
import {DiscountService} from '../../../../services/discount.service';
import {PlacetypeService} from '../../../../services/placetype.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {OwnershiptypeService} from '../../../../services/ownershiptype.service';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';
import {Connectionrequeststatus} from '../../../../entities/connectionrequeststatus';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';
import {ConnectionrequeststatusService} from '../../../../services/connectionrequeststatus.service';
import {ConnectionrequestitemUpdateSubFormComponent} from './connectionrequestitem-update-sub-form/connectionrequestitem-update-sub-form.component';

@Component({
  selector: 'app-connectionrequest-update-form',
  templateUrl: './connectionrequest-update-form.component.html',
  styleUrls: ['./connectionrequest-update-form.component.scss']
})
export class ConnectionrequestUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  connectionrequest: Connectionrequest;

  consumers: Consumer[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  @ViewChild(ConnectionrequestitemUpdateSubFormComponent) connectionrequestitemUpdateSubForm: ConnectionrequestitemUpdateSubFormComponent;
  placetypes: Placetype[] = [];
  ownershiptypes: Ownershiptype[] = [];
  connectiontypes: Connectiontype[] = [];
  connectionrequeststatuses: Connectionrequeststatus[] = [];
  discounts: Discount[] = [];

  form = new FormGroup({
    consumer: new FormControl(null, [
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    pobox: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    street: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    gramaniladharidiv: new FormControl(null, [
      Validators.required,
    ]),
    postaladdress: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    connectionrequestitems: new FormControl(),
    appicationfee: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    connectionfee: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    laborcost: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),

    vat: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    placetype: new FormControl(null, [
    ]),
    ownershiptype: new FormControl(null, [
    ]),
    connectiontype: new FormControl(null, [
    ]),
    connectionrequeststatus: new FormControl('1', [
      Validators.required,
    ]),
    discounts: new FormControl(),
    payslip: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get consumerField(): FormControl{
    return this.form.controls.consumer as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get poboxField(): FormControl{
    return this.form.controls.pobox as FormControl;
  }

  get streetField(): FormControl{
    return this.form.controls.street as FormControl;
  }

  get gramaniladharidivField(): FormControl{
    return this.form.controls.gramaniladharidiv as FormControl;
  }

  get postaladdressField(): FormControl{
    return this.form.controls.postaladdress as FormControl;
  }

  get connectionrequestitemsField(): FormControl{
    return this.form.controls.connectionrequestitems as FormControl;
  }

  get appicationfeeField(): FormControl{
    return this.form.controls.appicationfee as FormControl;
  }

  get connectionfeeField(): FormControl{
    return this.form.controls.connectionfee as FormControl;
  }

  get laborcostField(): FormControl{
    return this.form.controls.laborcost as FormControl;
  }



  get vatField(): FormControl{
    return this.form.controls.vat as FormControl;
  }

  get placetypeField(): FormControl{
    return this.form.controls.placetype as FormControl;
  }

  get ownershiptypeField(): FormControl{
    return this.form.controls.ownershiptype as FormControl;
  }

  get connectiontypeField(): FormControl{
    return this.form.controls.connectiontype as FormControl;
  }

  get connectionrequeststatusField(): FormControl{
    return this.form.controls.connectionrequeststatus as FormControl;
  }

  get discountsField(): FormControl{
    return this.form.controls.discounts as FormControl;
  }

  get payslipField(): FormControl{
    return this.form.controls.payslip as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumerService: ConsumerService,
    private gramaniladharidivService: GramaniladharidivService,
    private placetypeService: PlacetypeService,
    private ownershiptypeService: OwnershiptypeService,
    private connectiontypeService: ConnectiontypeService,
    private connectionrequeststatusService: ConnectionrequeststatusService,
    private discountService: DiscountService,
    private connectionrequestService: ConnectionrequestService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.discountService.getAllBasic(new PageRequest()).then((discountDataPage) => {
      this.discounts = discountDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.consumerService.getAllBasic(new PageRequest()).then((consumerDataPage) => {
      this.consumers = consumerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gramaniladharidivService.getAll().then((gramaniladharidivs) => {
      this.gramaniladharidivs = gramaniladharidivs;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.placetypeService.getAll().then((placetypes) => {
      this.placetypes = placetypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.ownershiptypeService.getAll().then((ownershiptypes) => {
      this.ownershiptypes = ownershiptypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.connectiontypeService.getAllBasic(new PageRequest()).then((connectiontypeDataPage) => {
      this.connectiontypes = connectiontypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.connectionrequeststatusService.getAll().then((connectionrequeststatuses) => {
      this.connectionrequeststatuses = connectionrequeststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.connectionrequest = await this.connectionrequestService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONREQUEST);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.consumerField.pristine) {
      this.consumerField.setValue(this.connectionrequest.consumer.id);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.connectionrequest.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.connectionrequest.land);
    }
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.connectionrequest.pobox);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.connectionrequest.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.connectionrequest.gramaniladharidiv.id);
    }
    if (this.postaladdressField.pristine) {
      this.postaladdressField.setValue(this.connectionrequest.postaladdress);
    }
    if (this.connectionrequestitemsField.pristine) {
      this.connectionrequestitemsField.setValue(this.connectionrequest.connectionrequestitemList);
    }
    if (this.appicationfeeField.pristine) {
      this.appicationfeeField.setValue(this.connectionrequest.appicationfee);
    }
    if (this.connectionfeeField.pristine) {
      this.connectionfeeField.setValue(this.connectionrequest.connectionfee);
    }
    if (this.laborcostField.pristine) {
      this.laborcostField.setValue(this.connectionrequest.laborcost);
    }

    if (this.vatField.pristine) {
      this.vatField.setValue(this.connectionrequest.vat);
    }
    if (this.placetypeField.pristine) {
      this.placetypeField.setValue(this.connectionrequest.placetype.id);
    }
    if (this.ownershiptypeField.pristine) {
      this.ownershiptypeField.setValue(this.connectionrequest.ownershiptype.id);
    }
    if (this.connectiontypeField.pristine) {
      this.connectiontypeField.setValue(this.connectionrequest.connectiontype.id);
    }
    if (this.connectionrequeststatusField.pristine) {
      this.connectionrequeststatusField.setValue(this.connectionrequest.connectionrequeststatus.id);
    }
    if (this.discountsField.pristine) {
      this.discountsField.setValue(this.connectionrequest.discountList);
    }
    if (this.payslipField.pristine) {
      if (this.connectionrequest.payslip) { this.payslipField.setValue([this.connectionrequest.payslip]); }
      else { this.payslipField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.connectionrequest.description);
    }
}

  async submit(): Promise<void> {
    this.connectionrequestitemUpdateSubForm.resetForm();
    this.connectionrequestitemsField.markAsDirty();
    this.discountsField.updateValueAndValidity();
    this.discountsField.markAsTouched();
    this.payslipField.updateValueAndValidity();
    this.payslipField.markAsTouched();
    if (this.form.invalid) { return; }

    const newconnectionrequest: Connectionrequest = new Connectionrequest();
    newconnectionrequest.consumer = this.consumerField.value;
    newconnectionrequest.mobile = this.mobileField.value;
    newconnectionrequest.land = this.landField.value;
    newconnectionrequest.pobox = this.poboxField.value;
    newconnectionrequest.street = this.streetField.value;
    newconnectionrequest.gramaniladharidiv = this.gramaniladharidivField.value;
    newconnectionrequest.postaladdress = this.postaladdressField.value;
    newconnectionrequest.connectionrequestitemList = this.connectionrequestitemsField.value;
    newconnectionrequest.appicationfee = this.appicationfeeField.value;
    newconnectionrequest.connectionfee = this.connectionfeeField.value;
    newconnectionrequest.laborcost = this.laborcostField.value;
    newconnectionrequest.vat = this.vatField.value;
    newconnectionrequest.placetype = this.placetypeField.value;
    newconnectionrequest.ownershiptype = this.ownershiptypeField.value;
    newconnectionrequest.connectiontype = this.connectiontypeField.value;
    newconnectionrequest.connectionrequeststatus = this.connectionrequeststatusField.value;
    newconnectionrequest.discountList = this.discountsField.value;
    const payslipIds = this.payslipField.value;
    if (payslipIds !== null && payslipIds !== []){
      newconnectionrequest.payslip = payslipIds[0];
    }else{
      newconnectionrequest.payslip = null;
    }
    newconnectionrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.connectionrequestService.update(this.selectedId, newconnectionrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connectionrequests/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/connectionrequests');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.consumer) { this.consumerField.setErrors({server: msg.consumer}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.pobox) { this.poboxField.setErrors({server: msg.pobox}); knownError = true; }
          if (msg.street) { this.streetField.setErrors({server: msg.street}); knownError = true; }
          if (msg.gramaniladharidiv) { this.gramaniladharidivField.setErrors({server: msg.gramaniladharidiv}); knownError = true; }
          if (msg.postaladdress) { this.postaladdressField.setErrors({server: msg.postaladdress}); knownError = true; }
          if (msg.connectionrequestitemList) { this.connectionrequestitemsField.setErrors({server: msg.connectionrequestitemList}); knownError = true; }
          if (msg.appicationfee) { this.appicationfeeField.setErrors({server: msg.appicationfee}); knownError = true; }
          if (msg.connectionfee) { this.connectionfeeField.setErrors({server: msg.connectionfee}); knownError = true; }
          if (msg.laborcost) { this.laborcostField.setErrors({server: msg.laborcost}); knownError = true; }
          if (msg.vat) { this.vatField.setErrors({server: msg.vat}); knownError = true; }
          if (msg.placetype) { this.placetypeField.setErrors({server: msg.placetype}); knownError = true; }
          if (msg.ownershiptype) { this.ownershiptypeField.setErrors({server: msg.ownershiptype}); knownError = true; }
          if (msg.connectiontype) { this.connectiontypeField.setErrors({server: msg.connectiontype}); knownError = true; }
          if (msg.connectionrequeststatus) { this.connectionrequeststatusField.setErrors({server: msg.connectionrequeststatus}); knownError = true; }
          if (msg.discountList) { this.discountsField.setErrors({server: msg.discountList}); knownError = true; }
          if (msg.payslip) { this.payslipField.setErrors({server: msg.payslip}); knownError = true; }
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
}
