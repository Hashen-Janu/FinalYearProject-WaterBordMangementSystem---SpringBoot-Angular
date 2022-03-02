import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Consumer} from '../../../../entities/consumer';
import {Placetype} from '../../../../entities/placetype';
import {DateHelper} from '../../../../shared/date-helper';
import {Ownershiptype} from '../../../../entities/ownershiptype';
import {ConsumerService} from '../../../../services/consumer.service';
import {Connectionstatus} from '../../../../entities/connectionstatus';
import {PlacetypeService} from '../../../../services/placetype.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {OwnershiptypeService} from '../../../../services/ownershiptype.service';
import {ConnectionstatusService} from '../../../../services/connectionstatus.service';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';

@Component({
  selector: 'app-connection-update-form',
  templateUrl: './connection-update-form.component.html',
  styleUrls: ['./connection-update-form.component.scss']
})
export class ConnectionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  connection: Connection;

  consumers: Consumer[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  placetypes: Placetype[] = [];
  ownershiptypes: Ownershiptype[] = [];
  connectionstatuses: Connectionstatus[] = [];

  form = new FormGroup({
    consumer: new FormControl(null, []),
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
      Validators.maxLength(255),
    ]),
    metersize: new FormControl(null, [
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(255),
    ]),
    watersupplysize: new FormControl(null, [
      Validators.minLength(0),
      Validators.maxLength(255),
    ]),
    initmeterreading: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern('^(?=.*[1-9].*)[0-9]{1,8}$'),
    ]),
    supplieddate: new FormControl(null, [
      Validators.required,
    ]),
    placetype: new FormControl(null, [
      Validators.required,
    ]),
    ownershiptype: new FormControl(null, [
      Validators.required,
    ]),
    connectionstatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

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

  get connectionstatusField(): FormControl {
    return this.form.controls.connectionstatus as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumerService: ConsumerService,
    private gramaniladharidivService: GramaniladharidivService,
    private placetypeService: PlacetypeService,
    private ownershiptypeService: OwnershiptypeService,
    private connectionstatusService: ConnectionstatusService,
    private connectionService: ConnectionService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.poboxField.disable();
    this.streetField.disable();
    this.gramaniladharidivField.disable();
    this.consumerField.disable();

    this.updatePrivileges();
    if (!this.privilege.update) {
      return;
    }

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
    this.connectionstatusService.getAll().then((connectionstatuses) => {
      this.connectionstatuses = connectionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.connection = await this.connectionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTION);
  }

  discardChanges(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void {
    if (this.consumerField.pristine) {
      this.consumerField.setValue(this.connection.consumer.id);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.connection.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.connection.land);
    }
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.connection.pobox);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.connection.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.connection.gramaniladharidiv.id);
    }
    if (this.meternoField.pristine) {
      this.meternoField.setValue(this.connection.meterno);
    }
    if (this.meterseelnoField.pristine) {
      this.meterseelnoField.setValue(this.connection.meterseelno);
    }
    if (this.metercircularField.pristine) {
      this.metercircularField.setValue(this.connection.metercircular);
    }
    if (this.metersizeField.pristine) {
      this.metersizeField.setValue(this.connection.metersize);
    }
    if (this.watersupplysizeField.pristine) {
      this.watersupplysizeField.setValue(this.connection.watersupplysize);
    }
    if (this.initmeterreadingField.pristine) {
      this.initmeterreadingField.setValue(this.connection.initmeterreading);
    }
    if (this.supplieddateField.pristine) {
      this.supplieddateField.setValue(this.connection.supplieddate);
    }
    if (this.placetypeField.pristine) {
      this.placetypeField.setValue(this.connection.placetype.id);
    }
    if (this.ownershiptypeField.pristine) {
      this.ownershiptypeField.setValue(this.connection.ownershiptype.id);
    }
    if (this.connectionstatusField.pristine) {
      this.connectionstatusField.setValue(this.connection.connectionstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.connection.description);
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const newconnection: Connection = new Connection();
    newconnection.consumer = this.consumerField.value;
    newconnection.mobile = this.mobileField.value;
    newconnection.land = this.landField.value;
    newconnection.pobox = this.poboxField.value;
    newconnection.street = this.streetField.value;
    newconnection.gramaniladharidiv = this.gramaniladharidivField.value;
    newconnection.meterno = this.meternoField.value;
    newconnection.meterseelno = this.meterseelnoField.value;
    newconnection.metercircular = this.metercircularField.value;
    newconnection.metersize = this.metersizeField.value;
    newconnection.watersupplysize = this.watersupplysizeField.value;
    newconnection.initmeterreading = this.initmeterreadingField.value;
    newconnection.supplieddate = DateHelper.getDateAsString(this.supplieddateField.value);
    newconnection.placetype = this.placetypeField.value;
    newconnection.ownershiptype = this.ownershiptypeField.value;
    newconnection.connectionstatus = this.connectionstatusField.value;
    newconnection.description = this.descriptionField.value;
    try {
      const resourceLink: ResourceLink = await this.connectionService.update(this.selectedId, newconnection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/connections/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/connections');
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
          if (msg.connectionstatus) {
            this.connectionstatusField.setErrors({server: msg.connectionstatus});
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

  disableForm(): void {
    if (this.connectionstatusField.value === 3){
      this.form.disable();
      this.connectionstatusField.enable();
    }else {
      this.form.enable();
      this.poboxField.disable();
      this.consumerField.disable();
      this.streetField.disable();
      this.gramaniladharidivField.disable();

    }
  }
}
