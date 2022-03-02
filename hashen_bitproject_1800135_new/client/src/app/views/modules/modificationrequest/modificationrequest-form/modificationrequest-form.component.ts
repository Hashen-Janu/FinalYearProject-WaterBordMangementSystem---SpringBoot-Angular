import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Modificationrequest} from '../../../../entities/modificationrequest';
import {ModificationrequestService} from '../../../../services/modificationrequest.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';

@Component({
  selector: 'app-modificationrequest-form',
  templateUrl: './modificationrequest-form.component.html',
  styleUrls: ['./modificationrequest-form.component.scss']
})
export class ModificationrequestFormComponent extends AbstractComponent implements OnInit {

  connections: Connection[] = [];

  form = new FormGroup({
    connection: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private modificationrequestService: ModificationrequestService,
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MODIFICATIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MODIFICATIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MODIFICATIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MODIFICATIONREQUEST);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const modificationrequest: Modificationrequest = new Modificationrequest();
    modificationrequest.connection = this.connectionField.value;
    modificationrequest.date = DateHelper.getDateAsString(this.dateField.value);
    modificationrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.modificationrequestService.add(modificationrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/modificationrequests/' + resourceLink.id);
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
