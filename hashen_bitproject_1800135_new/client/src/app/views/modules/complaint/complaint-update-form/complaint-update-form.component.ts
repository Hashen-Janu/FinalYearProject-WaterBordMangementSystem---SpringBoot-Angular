import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Complaint} from '../../../../entities/complaint';
import {ComplaintService} from '../../../../services/complaint.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Connection} from '../../../../entities/connection';
import {Complainttype} from '../../../../entities/complainttype';
import {Complaintstatus} from '../../../../entities/complaintstatus';
import {ConnectionService} from '../../../../services/connection.service';
import {ComplainttypeService} from '../../../../services/complainttype.service';
import {ComplaintstatusService} from '../../../../services/complaintstatus.service';

@Component({
  selector: 'app-complaint-update-form',
  templateUrl: './complaint-update-form.component.html',
  styleUrls: ['./complaint-update-form.component.scss']
})
export class ComplaintUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  complaint: Complaint;

  connections: Connection[] = [];
  complainttypes: Complainttype[] = [];
  complaintstatuses: Complaintstatus[] = [];

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

    complaintstatus: new FormControl('1', [
      Validators.required,
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
    complainername: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    description: new FormControl(null, [
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
  get complainernameField(): FormControl{
    return this.form.controls.complainername as FormControl;
  }

  get complaintstatusField(): FormControl{
    return this.form.controls.complaintstatus as FormControl;
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

  constructor(
    private connectionService: ConnectionService,
    private complainttypeService: ComplainttypeService,
    private complaintstatusService: ComplaintstatusService,
    private complaintService: ComplaintService,
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
    this.complainttypeService.getAll().then((complainttypes) => {
      this.complainttypes = complainttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.complaintstatusService.getAll().then((complaintstatuses) => {
      this.complaintstatuses = complaintstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.complaint = await this.complaintService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_COMPLAINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_COMPLAINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAINT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.connectionField.pristine) {
      this.connectionField.setValue(this.complaint.connection.id);
    }
    if (this.complainttypeField.pristine) {
      this.complainttypeField.setValue(this.complaint.complainttype.id);
    }
    if (this.contactField.pristine) {
      this.contactField.setValue(this.complaint.contact);
    }
    if (this.complainernameField.pristine) {
      this.complainernameField.setValue(this.complaint.complainername);
    }

    if (this.complaintstatusField.pristine) {
      this.complaintstatusField.setValue(this.complaint.complaintstatus.id);
    }
    if (this.titleField.pristine) {
      this.titleField.setValue(this.complaint.title);
    }
    if (this.locationField.pristine) {
      this.locationField.setValue(this.complaint.location);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.complaint.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newcomplaint: Complaint = new Complaint();
    newcomplaint.connection = this.connectionField.value;
    newcomplaint.complainttype = this.complainttypeField.value;
    newcomplaint.contact = this.contactField.value;
    newcomplaint.complaintstatus = this.complaintstatusField.value;
    newcomplaint.title = this.titleField.value;
    newcomplaint.location = this.locationField.value;
    newcomplaint.complainername = this.complainernameField.value;
    newcomplaint.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.complaintService.update(this.selectedId, newcomplaint);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/complaints/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/complaints');
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
          if (msg.complaintstatus) { this.complaintstatusField.setErrors({server: msg.complaintstatus}); knownError = true; }
          if (msg.title) { this.titleField.setErrors({server: msg.title}); knownError = true; }
          if (msg.location) { this.locationField.setErrors({server: msg.location}); knownError = true; }
          if (msg.complainername) { this.complainernameField.setErrors({server: msg.complainername}); knownError = true; }
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
