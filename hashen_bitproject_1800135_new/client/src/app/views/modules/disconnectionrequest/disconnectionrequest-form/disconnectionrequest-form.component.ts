import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Disconnectionrequest} from '../../../../entities/disconnectionrequest';
import {DisconnectionrequestService} from '../../../../services/disconnectionrequest.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {Disconnectiontype} from '../../../../entities/disconnectiontype';
import {ConnectionService} from '../../../../services/connection.service';
import {DisconnectiontypeService} from '../../../../services/disconnectiontype.service';

@Component({
  selector: 'app-disconnectionrequest-form',
  templateUrl: './disconnectionrequest-form.component.html',
  styleUrls: ['./disconnectionrequest-form.component.scss']
})
export class DisconnectionrequestFormComponent extends AbstractComponent implements OnInit {

  connections: Connection[] = [];
  disconnectiontypes: Disconnectiontype[] = [];

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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private disconnectiontypeService: DisconnectiontypeService,
    private disconnectionrequestService: DisconnectionrequestService,
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

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCONNECTIONREQUEST);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const disconnectionrequest: Disconnectionrequest = new Disconnectionrequest();
    disconnectionrequest.connection = this.connectionField.value;
    disconnectionrequest.date = DateHelper.getDateAsString(this.dateField.value);
    disconnectionrequest.disconnectiontype = this.disconnectiontypeField.value;
    disconnectionrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.disconnectionrequestService.add(disconnectionrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/disconnectionrequests/' + resourceLink.id);
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
          if (msg.connection) { this.connectionField.setErrors({server: msg.connection}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.disconnectiontype) { this.disconnectiontypeField.setErrors({server: msg.disconnectiontype}); knownError = true; }
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
