import {Component, OnInit} from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
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
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';
import {ConnectionrequestitemSubFormComponent} from './connectionrequestitem-sub-form/connectionrequestitem-sub-form.component';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {MatSelect} from '@angular/material/select';
import {map, startWith, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-connectionrequest-form',
  templateUrl: './connectionrequest-form.component.html',
  styleUrls: ['./connectionrequest-form.component.scss']
})
export class ConnectionrequestFormComponent extends AbstractComponent implements OnInit {

  consumers: Consumer[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  @ViewChild(ConnectionrequestitemSubFormComponent) connectionrequestitemSubForm: ConnectionrequestitemSubFormComponent;
  placetypes: Placetype[] = [];
  ownershiptypes: Ownershiptype[] = [];
  connectiontypes: Connectiontype[] = [];
  discounts: Discount[] = [];
  filteredOptions: Observable<Consumer[]>;

  selected: number;

  form = new FormGroup({
    consumer: new FormControl(null, []),
    // consumerFilterCtrl: new FormControl(null, []), // consumer combo
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

    placetype: new FormControl(null, []),
    ownershiptype: new FormControl(null, []),
    connectiontype: new FormControl(null, []),
    discounts: new FormControl(),
    payslip: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    searchemployee: new FormControl(),
  });

  // // consumer combo
  // filteredConsumer: ReplaySubject<Consumer[]> = new ReplaySubject<Consumer[]>(1);
  // @ViewChild('singleSelect') singleSelect: MatSelect;
  // protected _onDestroy = new  Subject<void>();

  get consumerField(): FormControl {
    return this.form.controls.consumer as FormControl;
  }

  get mobileField(): FormControl {
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl {
    return this.form.controls.land as FormControl;
  }

  get poboxField(): FormControl {
    return this.form.controls.pobox as FormControl;
  }

  get streetField(): FormControl {
    return this.form.controls.street as FormControl;
  }

  get gramaniladharidivField(): FormControl {
    return this.form.controls.gramaniladharidiv as FormControl;
  }

  get postaladdressField(): FormControl {
    return this.form.controls.postaladdress as FormControl;
  }

  get connectionrequestitemsField(): FormControl {
    return this.form.controls.connectionrequestitems as FormControl;
  }

  get appicationfeeField(): FormControl {
    return this.form.controls.appicationfee as FormControl;
  }

  get connectionfeeField(): FormControl {
    return this.form.controls.connectionfee as FormControl;
  }

  get laborcostField(): FormControl {
    return this.form.controls.laborcost as FormControl;
  }
  get searchemployeeField(): FormControl{
    return this.form.controls.searchemployee as FormControl;
  }




  get vatField(): FormControl {
    return this.form.controls.vat as FormControl;
  }

  get placetypeField(): FormControl {
    return this.form.controls.placetype as FormControl;
  }

  get ownershiptypeField(): FormControl {
    return this.form.controls.ownershiptype as FormControl;
  }

  get connectiontypeField(): FormControl {
    return this.form.controls.connectiontype as FormControl;
  }

  get discountsField(): FormControl {
    return this.form.controls.discounts as FormControl;
  }

  get payslipField(): FormControl {
    return this.form.controls.payslip as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumerService: ConsumerService,
    private gramaniladharidivService: GramaniladharidivService,
    private placetypeService: PlacetypeService,
    private ownershiptypeService: OwnershiptypeService,
    private connectiontypeService: ConnectiontypeService,
    private discountService: DiscountService,
    private connectionrequestService: ConnectionrequestService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchemployeeField.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployee(employee) : this.consumers.slice())
      );
  }
  private _filterEmployee(value: string): Consumer[] {
    const filterValue = value.toLowerCase();
    return this.consumers.filter(employee => employee.code.toLowerCase().indexOf(filterValue) === 0);
  }


  setSearchValue(option: any): void{
    console.log(option);
    this.consumerField.patchValue(option);

  }


  // async loadDiscounts(): Promise<any>{
  //   this.discountService.getAllByConnectiontype(this.connectiontypeField.value).then((discountDataPage) => {
  //     this.discounts = discountDataPage;
  //   }).catch((e) => {
  //     console.log(e);
  //     this.snackBar.open('Something is wrong', null, {duration: 2000});
  //   });

// }

  ngOnInit(): void {
    this.consumerService.getAllBasic(new PageRequest()).then((consumerDataPage) => {
      this.consumers = consumerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.discountService.getAllBasic(new PageRequest()).then((discountDataPage) => {
      this.discounts = discountDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    // // consumer combo
    // this.form.controls.consumer.setValue(this.consumers[10]);
    // this.filteredConsumer.next(this.consumers.slice());
    // this.form.controls.consumerFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterConsumer();
    //   });

    this.loadData();
    this.refreshData();
  }

  // // consumer combo
  // ngAfterViewInit() {
  //   this.setInitialValue();
  // }
  //
  // // consumer combo
  // ngOnDestroy() {
  //   this._onDestroy.next();
  //   this._onDestroy.complete();
  // }

  // //consumer set initial value
  // setInitialValue() {
  //   this.filteredConsumer
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       // setting the compareWith property to a comparison function
  //       // triggers initializing the selection according to the initial value of
  //       // the form control (i.e. _initializeSelection())
  //       // this needs to be done after the filteredBanks are loaded initially
  //       // and after the mat-option elements are available
  //       this.singleSelect.compareWith = (a: Consumer, b: Consumer) => a && b && a.id === b.id;
  //     });
  // }
// // consumer filter
//   filterConsumer() {
//     if (!this.consumers) {
//       return;
//     }
//     // get the search keyword
//     let search = this.form.controls.consumerFilterCtrl.value;
//     if (!search) {
//       this.filteredConsumer.next(this.consumers.slice());
//       return;
//     } else {
//       search = search.toLowerCase();
//     }
//     // filter the banks
//     this.filteredConsumer.next(
//       this.consumers.filter(consumer => consumer.firstname.toLowerCase().indexOf(search) > -1)
//     );
//   }

  async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.add) {
      return;
    }


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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONREQUEST);
  }
  setValues(): void{

    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.consumerField.value.contact1);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.consumerField.value.contact2);
    }
    if (this.postaladdressField.pristine) {
      this.postaladdressField.setValue(this.consumerField.value.address);
    }
  }

  async submit(): Promise<void> {
    this.connectionrequestitemSubForm.resetForm();
    this.connectionrequestitemsField.markAsDirty();
    this.discountsField.updateValueAndValidity();
    this.discountsField.markAsTouched();
    this.payslipField.updateValueAndValidity();
    this.payslipField.markAsTouched();
    if (this.form.invalid) {
      return;
    }

    const connectionrequest: Connectionrequest = new Connectionrequest();
    connectionrequest.consumer = this.consumerField.value;
    connectionrequest.mobile = this.mobileField.value;
    connectionrequest.land = this.landField.value;
    connectionrequest.pobox = this.poboxField.value;
    connectionrequest.street = this.streetField.value;
    connectionrequest.gramaniladharidiv = this.gramaniladharidivField.value;
    connectionrequest.postaladdress = this.postaladdressField.value;
    connectionrequest.connectionrequestitemList = this.connectionrequestitemsField.value;
    connectionrequest.appicationfee = this.appicationfeeField.value;
    connectionrequest.connectionfee = this.connectionfeeField.value;
    connectionrequest.laborcost = this.laborcostField.value;

    connectionrequest.vat = this.vatField.value;
    connectionrequest.placetype = this.placetypeField.value;
    connectionrequest.ownershiptype = this.ownershiptypeField.value;
    connectionrequest.connectiontype = this.connectiontypeField.value;
    connectionrequest.discountList = this.discountsField.value;
    const payslipIds = this.payslipField.value;
    if (payslipIds !== null && payslipIds !== []) {
      connectionrequest.payslip = payslipIds[0];
    } else {
      connectionrequest.payslip = null;
    }
    connectionrequest.description = this.descriptionField.value;
    try {
      const resourceLink: ResourceLink = await this.connectionrequestService.add(connectionrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connectionrequests/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.consumer) {
            this.consumerField.setErrors({server: msg.consumer});
            knownError = true;
          }
          if (msg.mobile) {
            this.mobileField.setErrors({server: msg.mobile});
            knownError = true;
          }
          if (msg.land) {
            this.landField.setErrors({server: msg.land});
            knownError = true;
          }
          if (msg.pobox) {
            this.poboxField.setErrors({server: msg.pobox});
            knownError = true;
          }
          if (msg.street) {
            this.streetField.setErrors({server: msg.street});
            knownError = true;
          }
          if (msg.gramaniladharidiv) {
            this.gramaniladharidivField.setErrors({server: msg.gramaniladharidiv});
            knownError = true;
          }
          if (msg.postaladdress) {
            this.postaladdressField.setErrors({server: msg.postaladdress});
            knownError = true;
          }
          if (msg.connectionrequestitemList) {
            this.connectionrequestitemsField.setErrors({server: msg.connectionrequestitemList});
            knownError = true;
          }
          if (msg.appicationfee) {
            this.appicationfeeField.setErrors({server: msg.appicationfee});
            knownError = true;
          }
          if (msg.connectionfee) {
            this.connectionfeeField.setErrors({server: msg.connectionfee});
            knownError = true;
          }
          if (msg.laborcost) {
            this.laborcostField.setErrors({server: msg.laborcost});
            knownError = true;
          }

          if (msg.vat) {
            this.vatField.setErrors({server: msg.vat});
            knownError = true;
          }
          if (msg.placetype) {
            this.placetypeField.setErrors({server: msg.placetype});
            knownError = true;
          }
          if (msg.ownershiptype) {
            this.ownershiptypeField.setErrors({server: msg.ownershiptype});
            knownError = true;
          }
          if (msg.connectiontype) {
            this.connectiontypeField.setErrors({server: msg.connectiontype});
            knownError = true;
          }
          if (msg.discountList) {
            this.discountsField.setErrors({server: msg.discountList});
            knownError = true;
          }
          if (msg.payslip) {
            this.payslipField.setErrors({server: msg.payslip});
            knownError = true;
          }
          if (msg.description) {
            this.descriptionField.setErrors({server: msg.description});
            knownError = true;
          }
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
