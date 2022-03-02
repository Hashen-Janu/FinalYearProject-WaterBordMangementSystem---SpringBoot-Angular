import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Disconnectionrequest} from '../../../../entities/disconnectionrequest';
import {DisconnectionrequestService} from '../../../../services/disconnectionrequest.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {Disconnectiontype} from '../../../../entities/disconnectiontype';
import {ConnectionService} from '../../../../services/connection.service';
import {DisconnectiontypeService} from '../../../../services/disconnectiontype.service';
import {Disconnectionrequeststatus} from '../../../../entities/disconnectionrequeststatus';
import {DisconnectionrequeststatusService} from '../../../../services/disconnectionrequeststatus.service';

@Component({
  selector: 'app-disconnectionrequest-update-form',
  templateUrl: './disconnectionrequest-update-form.component.html',
  styleUrls: ['./disconnectionrequest-update-form.component.scss']
})
export class DisconnectionrequestUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  disconnectionrequest: Disconnectionrequest;

  connections: Connection[] = [];
  disconnectiontypes: Disconnectiontype[] = [];
  disconnectionrequeststatuses: Disconnectionrequeststatus[] = [];

  form = new FormGroup({
    connection: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    disconnectiontype: new FormControl(null, [
      Validators.required,
    ]),
    disconnectionrequeststatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get connectionField(): FormControl{
    return this.form.controls.connection as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get disconnectiontypeField(): FormControl{
    return this.form.controls.disconnectiontype as FormControl;
  }

  get disconnectionrequeststatusField(): FormControl{
    return this.form.controls.disconnectionrequeststatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private disconnectiontypeService: DisconnectiontypeService,
    private disconnectionrequeststatusService: DisconnectionrequeststatusService,
    private disconnectionrequestService: DisconnectionrequestService,
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

    this.connectionService.getAllBasic(new PageRequest()).then((connectionDataPage) => {
      this.connections = connectionDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.disconnectiontypeService.getAll().then((disconnectiontypes) => {
      this.disconnectiontypes = disconnectiontypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.disconnectionrequeststatusService.getAll().then((disconnectionrequeststatuses) => {
      this.disconnectionrequeststatuses = disconnectionrequeststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.disconnectionrequest = await this.disconnectionrequestService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCONNECTIONREQUEST);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.connectionField.pristine) {
      this.connectionField.setValue(this.disconnectionrequest.connection.consumer);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.disconnectionrequest.date);
    }
    if (this.disconnectiontypeField.pristine) {
      this.disconnectiontypeField.setValue(this.disconnectionrequest.disconnectiontype.id);
    }
    if (this.disconnectionrequeststatusField.pristine) {
      this.disconnectionrequeststatusField.setValue(this.disconnectionrequest.disconnectionrequeststatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.disconnectionrequest.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newdisconnectionrequest: Disconnectionrequest = new Disconnectionrequest();
    newdisconnectionrequest.connection = this.connectionField.value;
    newdisconnectionrequest.date = DateHelper.getDateAsString(this.dateField.value);
    newdisconnectionrequest.disconnectiontype = this.disconnectiontypeField.value;
    newdisconnectionrequest.disconnectionrequeststatus = this.disconnectionrequeststatusField.value;
    newdisconnectionrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.disconnectionrequestService.update(this.selectedId, newdisconnectionrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/disconnectionrequests/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/disconnectionrequests');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.connection) { this.connectionField.setErrors({server: msg.connection}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.disconnectiontype) { this.disconnectiontypeField.setErrors({server: msg.disconnectiontype}); knownError = true; }
          if (msg.disconnectionrequeststatus) { this.disconnectionrequeststatusField.setErrors({server: msg.disconnectionrequeststatus}); knownError = true; }
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
