import {Component, OnInit} from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Consumer} from '../../../../entities/consumer';
import {Placetype} from '../../../../entities/placetype';
import {DateHelper} from '../../../../shared/date-helper';
import {Ownershiptype} from '../../../../entities/ownershiptype';
import {ConsumerService} from '../../../../services/consumer.service';
import {PlacetypeService} from '../../../../services/placetype.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {OwnershiptypeService} from '../../../../services/ownershiptype.service';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';
import {Connectionrequest} from '../../../../entities/connectionrequest';
import {ConnectionrequestService} from '../../../../services/connectionrequest.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent extends AbstractComponent implements OnInit {

  consumers: Consumer[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  placetypes: Placetype[] = [];
  ownershiptypes: Ownershiptype[] = [];
  connectionrequests: Connectionrequest[] = [];
  selectedId: number;

  // filteredOptions: Observable<Consumer[]>;

  form = new FormGroup({
    consumer: new FormControl(null, []),
    // searchconsumer: new FormControl(),


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
      Validators.minLength(4),
      Validators.maxLength(255),
    ]),
    street: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    gramaniladharidiv: new FormControl(null, []),
    meterno: new FormControl(null, [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
    meterseelno: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    metercircular: new FormControl(null, [
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(5),
    ]),
    metersize: new FormControl(null, [
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(255),
    ]),
    watersupplysize: new FormControl(null, [
      Validators.minLength(0),
      Validators.maxLength(5),
    ]),
    initmeterreading: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern('^([0]{4})[0-9]{2}$'),
    ]),
    supplieddate: new FormControl(null, [
      Validators.required,
    ]),
    placetype: new FormControl(null, [
      Validators.required,
    ]),
    ownershiptype: new FormControl(null, []),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),

    ]),
  });

  get consumerField(): FormControl {
    return this.form.controls.consumer as FormControl;
  }

  // get searcheconsumerField(): FormControl{
  //   return this.form.controls.searchconsumer as FormControl;
  // }

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

  get meternoField(): FormControl {
    return this.form.controls.meterno as FormControl;
  }

  get meterseelnoField(): FormControl {
    return this.form.controls.meterseelno as FormControl;
  }

  get metercircularField(): FormControl {
    return this.form.controls.metercircular as FormControl;
  }

  get metersizeField(): FormControl {
    return this.form.controls.metersize as FormControl;
  }

  get watersupplysizeField(): FormControl {
    return this.form.controls.watersupplysize as FormControl;
  }

  get initmeterreadingField(): FormControl {
    return this.form.controls.initmeterreading as FormControl;
  }

  get supplieddateField(): FormControl {
    return this.form.controls.supplieddate as FormControl;
  }

  get placetypeField(): FormControl {
    return this.form.controls.placetype as FormControl;
  }

  get ownershiptypeField(): FormControl {
    return this.form.controls.ownershiptype as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumerService: ConsumerService,
    private gramaniladharidivService: GramaniladharidivService,
    private placetypeService: PlacetypeService,
    private ownershiptypeService: OwnershiptypeService,
    private connectionService: ConnectionService,
    private connectionrequestService: ConnectionrequestService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    // this.filteredOptions = this.searcheconsumerField.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(consumer => consumer ? this._filterConsumer(consumer) : this.consumers.slice())
    //   );
  }

  ngOnInit(): void {
    this.consumerService.getAllBasic(new PageRequest()).then((consumerDataPage) => {
      this.consumers = consumerDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    // this.connectionrequestService.getAllBasic(new PageRequest()).then((connectionrequestDataPage) => {
    //   this.connectionrequests = connectionrequestDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });


    this.connectionrequestService.getAllDoneRequests(new PageRequest()).then((connectionrequestDataPage) => {
      this.connectionrequests = connectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.poboxField.disable();
    this.streetField.disable();
    this.gramaniladharidivField.disable();
    this.placetypeField.disable();
    this.ownershiptypeField.disable();

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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTION);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const connection: Connection = new Connection();
    connection.consumer = this.consumerField.value.consumer.id;
    connection.mobile = this.mobileField.value;
    connection.land = this.landField.value;
    connection.pobox = this.poboxField.value;
    connection.street = this.streetField.value;
    connection.gramaniladharidiv = this.gramaniladharidivField.value;
    connection.meterno = this.meternoField.value;
    connection.meterseelno = this.meterseelnoField.value;
    connection.metercircular = this.metercircularField.value;
    connection.metersize = this.metersizeField.value;
    connection.watersupplysize = this.watersupplysizeField.value;
    connection.initmeterreading = this.initmeterreadingField.value;
    connection.supplieddate = DateHelper.getDateAsString(this.supplieddateField.value);
    connection.placetype = this.placetypeField.value;
    connection.ownershiptype = this.ownershiptypeField.value;
    connection.description = this.descriptionField.value;
    try {
      const resourceLink: ResourceLink = await this.connectionService.add(connection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connections/' + resourceLink.id);
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
          if (msg.meterno) {
            this.meternoField.setErrors({server: msg.meterno});
            knownError = true;
          }
          if (msg.meterseelno) {
            this.meterseelnoField.setErrors({server: msg.meterseelno});
            knownError = true;
          }
          if (msg.metercircular) {
            this.metercircularField.setErrors({server: msg.metercircular});
            knownError = true;
          }
          if (msg.metersize) {
            this.metersizeField.setErrors({server: msg.metersize});
            knownError = true;
          }
          if (msg.watersupplysize) {
            this.watersupplysizeField.setErrors({server: msg.watersupplysize});
            knownError = true;
          }
          if (msg.initmeterreading) {
            this.initmeterreadingField.setErrors({server: msg.initmeterreading});
            knownError = true;
          }
          if (msg.supplieddate) {
            this.supplieddateField.setErrors({server: msg.supplieddate});
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
// combo
  // private _filterConsumer(value: string): Consumer[] {
  //   const filterValue = value.toLowerCase();
  //   return this.consumers.filter(consumer => consumer.code.toLowerCase().indexOf(filterValue) === 0);
  // }
  // setSearchValue(option: any): void{
  //   console.log(option);
  //   this.consumerField.patchValue(option);
  //
  // }

  setValues(): void {

    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.consumerField.value.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.consumerField.value.land);
    }
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.consumerField.value.pobox);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.consumerField.value.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.consumerField.value.gramaniladharidiv.id);
    }
    if (this.placetypeField.pristine) {
      this.placetypeField.setValue(this.consumerField.value.placetype.id);
    }
    if (this.ownershiptypeField.pristine) {
      this.ownershiptypeField.setValue(this.consumerField.value.ownershiptype.id);
    }
  }

  // setValues1(): void {
  //   if (this.poboxField.pristine) {
  //     this.poboxField.setValue(this.consumerField.value.connectionrequest.pobox);
  //   }
  //   if (this.streetField.pristine) {
  //     this.streetField.setValue(this.consumerField.value.connectionrequest.street);
  //   }
  //   if (this.gramaniladharidivField.pristine) {
  //     this.gramaniladharidivField.setValue(this.consumerField.value.connectionrequest.gramaniladharidiv.id);
  //   }
  // }

  // async loadRequestdetails(): Promise<any> {
  //   this.connectionrequestService.getRequestdetails(this.selectedId = this.consumerField.value.id).then((data: Connectionrequest) => {
  //     this.connectionrequest = data;
  //   }).catch(e => {
  //     console.log(e);
  //     this.snackBar.open('Something is wrong', null, {duration: 2000});
  //   });
  //
  // }

  // setCRvalues(): void {
  //
  //   if (this.poboxField.pristine) {
  //     this.poboxField.setValue(this.connectionrequest.pobox);
  //   }
  //   if (this.streetField.pristine) {
  //     this.streetField.setValue(this.connectionrequest.street);
  //   }
  //   if (this.gramaniladharidivField.pristine) {
  //     this.gramaniladharidivField.setValue(this.connectionrequest.gramaniladharidiv.id);
  //   }
  //
  //
  // }
  Maxdate(): any {
    return new Date();
  }
}
