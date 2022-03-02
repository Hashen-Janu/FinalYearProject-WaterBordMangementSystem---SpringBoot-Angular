import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Reconnectionrequest} from '../../../../entities/reconnectionrequest';
import {ReconnectionrequestService} from '../../../../services/reconnectionrequest.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Reconnectionrequeststatus} from '../../../../entities/reconnectionrequeststatus';
import {ReconnectionrequeststatusService} from '../../../../services/reconnectionrequeststatus.service';

@Component({
  selector: 'app-reconnectionrequest-update-form',
  templateUrl: './reconnectionrequest-update-form.component.html',
  styleUrls: ['./reconnectionrequest-update-form.component.scss']
})
export class ReconnectionrequestUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  reconnectionrequest: Reconnectionrequest;

  connections: Connection[] = [];
  reconnectionrequeststatuses: Reconnectionrequeststatus[] = [];

  form = new FormGroup({
    connection: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    reconnectionrequeststatus: new FormControl('1', [
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

  get reconnectionrequeststatusField(): FormControl{
    return this.form.controls.reconnectionrequeststatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private reconnectionrequeststatusService: ReconnectionrequeststatusService,
    private reconnectionrequestService: ReconnectionrequestService,
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
    this.reconnectionrequeststatusService.getAll().then((reconnectionrequeststatuses) => {
      this.reconnectionrequeststatuses = reconnectionrequeststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.reconnectionrequest = await this.reconnectionrequestService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RECONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RECONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RECONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RECONNECTIONREQUEST);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.connectionField.pristine) {
      this.connectionField.setValue(this.reconnectionrequest.connection.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.reconnectionrequest.date);
    }
    if (this.reconnectionrequeststatusField.pristine) {
      this.reconnectionrequeststatusField.setValue(this.reconnectionrequest.reconnectionrequeststatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.reconnectionrequest.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newreconnectionrequest: Reconnectionrequest = new Reconnectionrequest();
    newreconnectionrequest.connection = this.connectionField.value;
    newreconnectionrequest.date = DateHelper.getDateAsString(this.dateField.value);
    newreconnectionrequest.reconnectionrequeststatus = this.reconnectionrequeststatusField.value;
    newreconnectionrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.reconnectionrequestService.update(this.selectedId, newreconnectionrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/reconnectionrequests/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/reconnectionrequests');
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
          if (msg.reconnectionrequeststatus) { this.reconnectionrequeststatusField.setErrors({server: msg.reconnectionrequeststatus}); knownError = true; }
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
