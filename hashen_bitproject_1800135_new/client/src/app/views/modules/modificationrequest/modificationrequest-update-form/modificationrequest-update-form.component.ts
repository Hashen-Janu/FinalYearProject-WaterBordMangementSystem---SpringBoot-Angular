import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Modificationrequest} from '../../../../entities/modificationrequest';
import {ModificationrequestService} from '../../../../services/modificationrequest.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Modificationrequeststatus} from '../../../../entities/modificationrequeststatus';
import {ModificationrequeststatusService} from '../../../../services/modificationrequeststatus.service';

@Component({
  selector: 'app-modificationrequest-update-form',
  templateUrl: './modificationrequest-update-form.component.html',
  styleUrls: ['./modificationrequest-update-form.component.scss']
})
export class ModificationrequestUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  modificationrequest: Modificationrequest;

  connections: Connection[] = [];
  modificationrequeststatuses: Modificationrequeststatus[] = [];

  form = new FormGroup({
    connection: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    modificationrequeststatus: new FormControl('1', [
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

  get modificationrequeststatusField(): FormControl{
    return this.form.controls.modificationrequeststatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private modificationrequeststatusService: ModificationrequeststatusService,
    private modificationrequestService: ModificationrequestService,
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
    this.modificationrequeststatusService.getAll().then((modificationrequeststatuses) => {
      this.modificationrequeststatuses = modificationrequeststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.modificationrequest = await this.modificationrequestService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MODIFICATIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MODIFICATIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MODIFICATIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MODIFICATIONREQUEST);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.connectionField.pristine) {
      this.connectionField.setValue(this.modificationrequest.connection.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.modificationrequest.date);
    }
    if (this.modificationrequeststatusField.pristine) {
      this.modificationrequeststatusField.setValue(this.modificationrequest.modificationrequeststatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.modificationrequest.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newmodificationrequest: Modificationrequest = new Modificationrequest();
    newmodificationrequest.connection = this.connectionField.value;
    newmodificationrequest.date = DateHelper.getDateAsString(this.dateField.value);
    newmodificationrequest.modificationrequeststatus = this.modificationrequeststatusField.value;
    newmodificationrequest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.modificationrequestService.update(this.selectedId, newmodificationrequest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/modificationrequests/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/modificationrequests');
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
          if (msg.modificationrequeststatus) { this.modificationrequeststatusField.setErrors({server: msg.modificationrequeststatus}); knownError = true; }
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
