import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Complaint} from '../../../../entities/complaint';
import {ComplaintService} from '../../../../services/complaint.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {Complainttype} from '../../../../entities/complainttype';
import {ConnectionService} from '../../../../services/connection.service';
import {ComplainttypeService} from '../../../../services/complainttype.service';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.scss']
})
export class ComplaintFormComponent extends AbstractComponent implements OnInit {

  connections: Connection[] = [];
  complainttypes: Complainttype[] = [];

  form = new FormGroup({
    connection: new FormControl(null, [
      Validators.required,
    ]),
    complainttype: new FormControl(null, [
      Validators.required,
    ]),
    contact: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),

    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    location: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    complainername: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get connectionField(): FormControl{
    return this.form.controls.connection as FormControl;
  }

  get complainttypeField(): FormControl{
    return this.form.controls.complainttype as FormControl;
  }

  get contactField(): FormControl{
    return this.form.controls.contact as FormControl;
  }

  get titleField(): FormControl{
    return this.form.controls.title as FormControl;
  }

  get locationField(): FormControl{
    return this.form.controls.location as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get complainernameField(): FormControl{
    return this.form.controls.complainername as FormControl;
  }

  constructor(
    private connectionService: ConnectionService,
    private complainttypeService: ComplainttypeService,
    private complaintService: ComplaintService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.connectionService.getAllBasic(new PageRequest()).then((connectionDataPage) => {
      this.connections = connectionDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }


    this.complainttypeService.getAll().then((complainttypes) => {
      this.complainttypes = complainttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_COMPLAINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_COMPLAINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAINT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const complaint: Complaint = new Complaint();
    complaint.connection = this.connectionField.value.id;
    complaint.complainttype = this.complainttypeField.value;
    complaint.contact = this.contactField.value;
    complaint.title = this.titleField.value;
    complaint.location = this.locationField.value;
    complaint.description = this.descriptionField.value;
    complaint.complainername = this.complainernameField.value;
    try{
      const resourceLink: ResourceLink = await this.complaintService.add(complaint);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/complaints/' + resourceLink.id);
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
          if (msg.complainttype) { this.complainttypeField.setErrors({server: msg.complainttype}); knownError = true; }
          if (msg.contact) { this.contactField.setErrors({server: msg.contact}); knownError = true; }
          if (msg.title) { this.titleField.setErrors({server: msg.title}); knownError = true; }
          if (msg.location) { this.locationField.setErrors({server: msg.location}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.complainername) { this.complainernameField.setErrors({server: msg.complainername}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  setValues(): void{
    if (this.locationField.pristine) {
      this.locationField.setValue(this.connectionField.value.connectionrequest.postaladdress);
    }
  }
}
