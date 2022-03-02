import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Taskallocation} from '../../../../entities/taskallocation';
import {TaskallocationService} from '../../../../services/taskallocation.service';
import {ViewChild} from '@angular/core';
import {Vehicle} from '../../../../entities/vehicle';
import {Tasktype} from '../../../../entities/tasktype';
import {Employee} from '../../../../entities/employee';
import {Complaint} from '../../../../entities/complaint';
import {DateHelper} from '../../../../shared/date-helper';
import {VehicleService} from '../../../../services/vehicle.service';
import {TasktypeService} from '../../../../services/tasktype.service';
import {EmployeeService} from '../../../../services/employee.service';
import {ComplaintService} from '../../../../services/complaint.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {Connectionrequest} from '../../../../entities/connectionrequest';
import {Reconnectionrequest} from '../../../../entities/reconnectionrequest';
import {Modificationrequest} from '../../../../entities/modificationrequest';
import {Disconnectionrequest} from '../../../../entities/disconnectionrequest';
import {Taskallocationstatus} from '../../../../entities/taskallocationstatus';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';
import {ConnectionrequestService} from '../../../../services/connectionrequest.service';
import {ReconnectionrequestService} from '../../../../services/reconnectionrequest.service';
import {ModificationrequestService} from '../../../../services/modificationrequest.service';
import {DisconnectionrequestService} from '../../../../services/disconnectionrequest.service';
import {TaskallocationstatusService} from '../../../../services/taskallocationstatus.service';
import {TaskallocationitemUpdateSubFormComponent} from './taskallocationitem-update-sub-form/taskallocationitem-update-sub-form.component';

@Component({
  selector: 'app-taskallocation-update-form',
  templateUrl: './taskallocation-update-form.component.html',
  styleUrls: ['./taskallocation-update-form.component.scss']
})
export class TaskallocationUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  taskallocation: Taskallocation;

  tasktypes: Tasktype[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  connectionrequests: Connectionrequest[] = [];
  disconnectionrequests: Disconnectionrequest[] = [];
  reconnectionrequests: Reconnectionrequest[] = [];
  modificationrequests: Modificationrequest[] = [];
  complaints: Complaint[] = [];
  taskallocationstatuses: Taskallocationstatus[] = [];
  @ViewChild(TaskallocationitemUpdateSubFormComponent) taskallocationitemUpdateSubForm: TaskallocationitemUpdateSubFormComponent;
  vehicles: Vehicle[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    time: new FormControl(null, [
      Validators.required,
    ]),
    tasktype: new FormControl(null, [
      Validators.required,
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
    ]),
    connectionrequest: new FormControl(null, [
      Validators.required,
    ]),
    disconnectionrequest: new FormControl(null, [
      Validators.required,
    ]),
    reconnectionrequest: new FormControl(null, [
      Validators.required,
    ]),
    modificationrequest: new FormControl(null, [
      Validators.required,
    ]),
    complaint: new FormControl(null, [
      Validators.required,
    ]),
    taskallocationstatus: new FormControl(null, [
      Validators.required,
    ]),
    remarks: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    taskallocationitems: new FormControl(),
    vehicles: new FormControl(),
    employees: new FormControl(),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get timeField(): FormControl{
    return this.form.controls.time as FormControl;
  }

  get tasktypeField(): FormControl{
    return this.form.controls.tasktype as FormControl;
  }

  get poboxField(): FormControl{
    return this.form.controls.pobox as FormControl;
  }

  get streetField(): FormControl{
    return this.form.controls.street as FormControl;
  }

  get gramaniladharidivField(): FormControl{
    return this.form.controls.gramaniladharidiv as FormControl;
  }

  get connectionrequestField(): FormControl{
    return this.form.controls.connectionrequest as FormControl;
  }

  get disconnectionrequestField(): FormControl{
    return this.form.controls.disconnectionrequest as FormControl;
  }

  get reconnectionrequestField(): FormControl{
    return this.form.controls.reconnectionrequest as FormControl;
  }

  get modificationrequestField(): FormControl{
    return this.form.controls.modificationrequest as FormControl;
  }

  get complaintField(): FormControl{
    return this.form.controls.complaint as FormControl;
  }

  get taskallocationstatusField(): FormControl{
    return this.form.controls.taskallocationstatus as FormControl;
  }

  get remarksField(): FormControl{
    return this.form.controls.remarks as FormControl;
  }

  get taskallocationitemsField(): FormControl{
    return this.form.controls.taskallocationitems as FormControl;
  }

  get vehiclesField(): FormControl{
    return this.form.controls.vehicles as FormControl;
  }

  get employeesField(): FormControl{
    return this.form.controls.employees as FormControl;
  }

  constructor(
    private tasktypeService: TasktypeService,
    private gramaniladharidivService: GramaniladharidivService,
    private connectionrequestService: ConnectionrequestService,
    private disconnectionrequestService: DisconnectionrequestService,
    private reconnectionrequestService: ReconnectionrequestService,
    private modificationrequestService: ModificationrequestService,
    private complaintService: ComplaintService,
    private taskallocationstatusService: TaskallocationstatusService,
    private vehicleService: VehicleService,
    private employeeService: EmployeeService,
    private taskallocationService: TaskallocationService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.vehicleService.getAllBasic(new PageRequest()).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.tasktypeService.getAll().then((tasktypes) => {
      this.tasktypes = tasktypes;
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
    this.connectionrequestService.getAllBasic(new PageRequest()).then((connectionrequestDataPage) => {
      this.connectionrequests = connectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.disconnectionrequestService.getAllBasic(new PageRequest()).then((disconnectionrequestDataPage) => {
      this.disconnectionrequests = disconnectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.reconnectionrequestService.getAllBasic(new PageRequest()).then((reconnectionrequestDataPage) => {
      this.reconnectionrequests = reconnectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.modificationrequestService.getAllBasic(new PageRequest()).then((modificationrequestDataPage) => {
      this.modificationrequests = modificationrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.complaintService.getAllBasic(new PageRequest()).then((complaintDataPage) => {
      this.complaints = complaintDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.taskallocationstatusService.getAll().then((taskallocationstatuses) => {
      this.taskallocationstatuses = taskallocationstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.taskallocation = await this.taskallocationService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASKALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASKALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASKALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASKALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASKALLOCATION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.taskallocation.date);
    }
    if (this.timeField.pristine) {
      this.timeField.setValue(this.taskallocation.time);
    }
    if (this.tasktypeField.pristine) {
      this.tasktypeField.setValue(this.taskallocation.tasktype.id);
    }
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.taskallocation.pobox);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.taskallocation.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.taskallocation.gramaniladharidiv.id);
    }
    if (this.connectionrequestField.pristine) {
      this.connectionrequestField.setValue(this.taskallocation.connectionrequest.id);
    }
    if (this.disconnectionrequestField.pristine) {
      this.disconnectionrequestField.setValue(this.taskallocation.disconnectionrequest.id);
    }
    if (this.reconnectionrequestField.pristine) {
      this.reconnectionrequestField.setValue(this.taskallocation.reconnectionrequest.id);
    }
    if (this.modificationrequestField.pristine) {
      this.modificationrequestField.setValue(this.taskallocation.modificationrequest.id);
    }
    if (this.complaintField.pristine) {
      this.complaintField.setValue(this.taskallocation.complaint.id);
    }
    if (this.taskallocationstatusField.pristine) {
      this.taskallocationstatusField.setValue(this.taskallocation.taskallocationstatus.id);
    }
    if (this.remarksField.pristine) {
      this.remarksField.setValue(this.taskallocation.remarks);
    }
    if (this.taskallocationitemsField.pristine) {
      this.taskallocationitemsField.setValue(this.taskallocation.taskallocationitemList);
    }
    if (this.vehiclesField.pristine) {
      this.vehiclesField.setValue(this.taskallocation.vehicleList);
    }
    if (this.employeesField.pristine) {
      this.employeesField.setValue(this.taskallocation.employeeList);
    }
}

  async submit(): Promise<void> {
    this.taskallocationitemUpdateSubForm.resetForm();
    this.taskallocationitemsField.markAsDirty();
    this.vehiclesField.updateValueAndValidity();
    this.vehiclesField.markAsTouched();
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) { return; }

    const newtaskallocation: Taskallocation = new Taskallocation();
    newtaskallocation.date = DateHelper.getDateAsString(this.dateField.value);
    newtaskallocation.time = this.timeField.value;
    newtaskallocation.tasktype = this.tasktypeField.value;
    newtaskallocation.pobox = this.poboxField.value;
    newtaskallocation.street = this.streetField.value;
    newtaskallocation.gramaniladharidiv = this.gramaniladharidivField.value;
    newtaskallocation.connectionrequest = this.connectionrequestField.value;
    newtaskallocation.disconnectionrequest = this.disconnectionrequestField.value;
    newtaskallocation.reconnectionrequest = this.reconnectionrequestField.value;
    newtaskallocation.modificationrequest = this.modificationrequestField.value;
    newtaskallocation.complaint = this.complaintField.value;
    newtaskallocation.taskallocationstatus = this.taskallocationstatusField.value;
    newtaskallocation.remarks = this.remarksField.value;
    newtaskallocation.taskallocationitemList = this.taskallocationitemsField.value;
    newtaskallocation.vehicleList = this.vehiclesField.value;
    newtaskallocation.employeeList = this.employeesField.value;
    try{
      const resourceLink: ResourceLink = await this.taskallocationService.update(this.selectedId, newtaskallocation);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/taskallocations/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/taskallocations');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.time) { this.timeField.setErrors({server: msg.time}); knownError = true; }
          if (msg.tasktype) { this.tasktypeField.setErrors({server: msg.tasktype}); knownError = true; }
          if (msg.pobox) { this.poboxField.setErrors({server: msg.pobox}); knownError = true; }
          if (msg.street) { this.streetField.setErrors({server: msg.street}); knownError = true; }
          if (msg.gramaniladharidiv) { this.gramaniladharidivField.setErrors({server: msg.gramaniladharidiv}); knownError = true; }
          if (msg.connectionrequest) { this.connectionrequestField.setErrors({server: msg.connectionrequest}); knownError = true; }
          if (msg.disconnectionrequest) { this.disconnectionrequestField.setErrors({server: msg.disconnectionrequest}); knownError = true; }
          if (msg.reconnectionrequest) { this.reconnectionrequestField.setErrors({server: msg.reconnectionrequest}); knownError = true; }
          if (msg.modificationrequest) { this.modificationrequestField.setErrors({server: msg.modificationrequest}); knownError = true; }
          if (msg.complaint) { this.complaintField.setErrors({server: msg.complaint}); knownError = true; }
          if (msg.taskallocationstatus) { this.taskallocationstatusField.setErrors({server: msg.taskallocationstatus}); knownError = true; }
          if (msg.remarks) { this.remarksField.setErrors({server: msg.remarks}); knownError = true; }
          if (msg.taskallocationitemList) { this.taskallocationitemsField.setErrors({server: msg.taskallocationitemList}); knownError = true; }
          if (msg.vehicleList) { this.vehiclesField.setErrors({server: msg.vehicleList}); knownError = true; }
          if (msg.employeeList) { this.employeesField.setErrors({server: msg.employeeList}); knownError = true; }
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
