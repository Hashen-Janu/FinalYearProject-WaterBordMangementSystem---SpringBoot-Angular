import {Component, OnInit} from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
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
import {TaskallocationitemSubFormComponent} from './taskallocationitem-sub-form/taskallocationitem-sub-form.component';

@Component({
  selector: 'app-taskallocation-form',
  templateUrl: './taskallocation-form.component.html',
  styleUrls: ['./taskallocation-form.component.scss']
})
export class TaskallocationFormComponent extends AbstractComponent implements OnInit {


  get dateField(): FormControl {
    return this.form.controls.date as FormControl;
  }

  get timeField(): FormControl {
    return this.form.controls.time as FormControl;
  }

  get tasktypeField(): FormControl {
    return this.form.controls.tasktype as FormControl;
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

  get connectionrequestField(): FormControl {
    return this.form.controls.connectionrequest as FormControl;
  }

  get disconnectionrequestField(): FormControl {
    return this.form.controls.disconnectionrequest as FormControl;
  }

  get reconnectionrequestField(): FormControl {
    return this.form.controls.reconnectionrequest as FormControl;
  }

  get modificationrequestField(): FormControl {
    return this.form.controls.modificationrequest as FormControl;
  }

  get complaintField(): FormControl {
    return this.form.controls.complaint as FormControl;
  }


  get remarksField(): FormControl {
    return this.form.controls.remarks as FormControl;
  }

  get taskallocationitemsField(): FormControl {
    return this.form.controls.taskallocationitems as FormControl;
  }

  get vehiclesField(): FormControl {
    return this.form.controls.vehicles as FormControl;
  }

  get employeesField(): FormControl {
    return this.form.controls.employees as FormControl;
  }

  get titleField(): FormControl {
    return this.form.controls.title as FormControl;
  }

  constructor(
    private tasktypeService: TasktypeService,
    private gramaniladharidivService: GramaniladharidivService,
    private connectionrequestService: ConnectionrequestService,
    private disconnectionrequestService: DisconnectionrequestService,
    private reconnectionrequestService: ReconnectionrequestService,
    private modificationrequestService: ModificationrequestService,
    private complaintService: ComplaintService,
    private vehicleService: VehicleService,
    private employeeService: EmployeeService,
    private taskallocationService: TaskallocationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  unit = 1;
  tasktypes: Tasktype[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  connectionrequests: Connectionrequest[] = [];
  disconnectionrequests: Disconnectionrequest[] = [];
  reconnectionrequests: Reconnectionrequest[] = [];
  modificationrequests: Modificationrequest[] = [];
  complaints: Complaint[] = [];
  @ViewChild(TaskallocationitemSubFormComponent) taskallocationitemSubForm: TaskallocationitemSubFormComponent;
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
    gramaniladharidiv: new FormControl(null, []),
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
    remarks: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    taskallocationitems: new FormControl(),
    vehicles: new FormControl(),
    employees: new FormControl(),
    // add title to form (Complaint requiest ekekata withari title tiyenne)
    title: new FormControl(),
  });
  getEmployeesToString = (obj: Employee) => `${obj.nametitle.name}  ${obj.callingname}`;
  getVehicleToString = (obj: Vehicle) => `${obj.no}  ${obj.vehicletype.name}`;

  ngOnInit(): void {

    this.complaintService.getAllPendingComplains(new PageRequest()).then((complaintDataPage) => {
      this.complaints = complaintDataPage.content;
      console.log(this.complaints);
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.connectionrequestService.getAllDoneRequests(new PageRequest()).then((connectionrequestDataPage) => {
      this.connectionrequests = connectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.disconnectionrequestService.getAllPendingDisconnectionrequest(new PageRequest()).then((disconnectionrequestDataPage) => {
      this.disconnectionrequests = disconnectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.reconnectionrequestService.getAllPendingReconnectionrequest(new PageRequest()).then((reconnectionrequestDataPage) => {
      this.reconnectionrequests = reconnectionrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.modificationrequestService.getAllPendingModificationrequest(new PageRequest()).then((modificationrequestDataPage) => {
      this.modificationrequests = modificationrequestDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });


    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {

    this.updatePrivileges();
    if (!this.privilege.add) {
      return;
    }
    if (this.tasktypeField.value) {
      if (this.tasktypeField.value === 2) {
        this.unit = 2;
      } else {
        this.unit = 1;
      }
    }
    this.vehicleService.getAllByUnit(this.unit).then((vehicleDataPage) => {
      this.vehicles = vehicleDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllByUnit(this.unit).then((employeeDataPage) => {
      this.employees = employeeDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
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
    // this.connectionrequestService.getAllBasic(new PageRequest()).then((connectionrequestDataPage) => {
    //   this.connectionrequests = connectionrequestDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });


    // this.disconnectionrequestService.getAllBasic(new PageRequest()).then((disconnectionrequestDataPage) => {
    //   this.disconnectionrequests = disconnectionrequestDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });



    // this.reconnectionrequestService.getAllBasic(new PageRequest()).then((reconnectionrequestDataPage) => {
    //   this.reconnectionrequests = reconnectionrequestDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });


    // this.modificationrequestService.getAllBasic(new PageRequest()).then((modificationrequestDataPage) => {
    //   this.modificationrequests = modificationrequestDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });


    // this.complaintService.getAllBasic(new PageRequest()).then((complaintDataPage) => {
    //   this.complaints = complaintDataPage.content;
    // }).catch((e) => {
    //   console.log(e);
    //   this.snackBar.open('Something is wrong', null, {duration: 2000});
    // });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASKALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASKALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASKALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASKALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASKALLOCATION);
  }

  async submit(): Promise<void> {
    this.taskallocationitemSubForm.resetForm();
    this.taskallocationitemsField.markAsDirty();
    this.vehiclesField.updateValueAndValidity();
    this.vehiclesField.markAsTouched();
    this.employeesField.updateValueAndValidity();
    this.employeesField.markAsTouched();
    if (this.form.invalid) {
      return;
    }

    const taskallocation: Taskallocation = new Taskallocation();
    taskallocation.date = DateHelper.getDateAsString(this.dateField.value);
    taskallocation.time = this.timeField.value;
    taskallocation.tasktype = this.tasktypeField.value;
    taskallocation.pobox = this.poboxField.value;
    //add title to submit data
    taskallocation.title = this.titleField.value;
    taskallocation.street = this.streetField.value;
    taskallocation.gramaniladharidiv = this.gramaniladharidivField.value;
    if (this.connectionrequestField.value){
      taskallocation.connectionrequest = (this.connectionrequestField.value === '') ? null : this.connectionrequestField.value.id;
    }
    if (this.disconnectionrequestField.value){
      taskallocation.disconnectionrequest = (this.disconnectionrequestField.value === '') ? null : this.disconnectionrequestField.value.id;
    }
    if (this.reconnectionrequestField.value){
      taskallocation.reconnectionrequest = (this.reconnectionrequestField.value === '') ? null : this.reconnectionrequestField.value.id;
    }
    if (this.modificationrequestField.value){
      taskallocation.modificationrequest = (this.modificationrequestField.value === '') ? null : this.modificationrequestField.value.id;
    }
    if (this.complaintField.value){
      taskallocation.complaint = (this.complaintField.value === '') ? null : this.complaintField.value.id;
    }
    taskallocation.remarks = this.remarksField.value;
    taskallocation.taskallocationitemList = this.taskallocationitemsField.value;
    taskallocation.vehicleList = this.vehiclesField.value;
    taskallocation.employeeList = this.employeesField.value;
    try {
      const resourceLink: ResourceLink = await this.taskallocationService.add(taskallocation);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/taskallocations/' + resourceLink.id);
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
          if (msg.date) {
            this.dateField.setErrors({server: msg.date});
            knownError = true;
          }
          if (msg.time) {
            this.timeField.setErrors({server: msg.time});
            knownError = true;
          }
          if (msg.tasktype) {
            this.tasktypeField.setErrors({server: msg.tasktype});
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
          if (msg.connectionrequest) {
            this.connectionrequestField.setErrors({server: msg.connectionrequest});
            knownError = true;
          }
          if (msg.disconnectionrequest) {
            this.disconnectionrequestField.setErrors({server: msg.disconnectionrequest});
            knownError = true;
          }
          if (msg.reconnectionrequest) {
            this.reconnectionrequestField.setErrors({server: msg.reconnectionrequest});
            knownError = true;
          }
          if (msg.modificationrequest) {
            this.modificationrequestField.setErrors({server: msg.modificationrequest});
            knownError = true;
          }
          if (msg.complaint) {
            this.complaintField.setErrors({server: msg.complaint});
            knownError = true;
          }
          if (msg.remarks) {
            this.remarksField.setErrors({server: msg.remarks});
            knownError = true;
          }
          if (msg.taskallocationitemList) {
            this.taskallocationitemsField.setErrors({server: msg.taskallocationitemList});
            knownError = true;
          }
          if (msg.vehicleList) {
            this.vehiclesField.setErrors({server: msg.vehicleList});
            knownError = true;
          }
          if (msg.employeeList) {
            this.employeesField.setErrors({server: msg.employeeList});
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

  validation(): void {

    this.connectionrequestField.setValidators(null);
    this.connectionrequestField.updateValueAndValidity();

    this.modificationrequestField.setValidators(null);
    this.modificationrequestField.updateValueAndValidity();

    this.disconnectionrequestField.setValidators(null);
    this.disconnectionrequestField.updateValueAndValidity();

    this.reconnectionrequestField.setValidators(null);
    this.reconnectionrequestField.updateValueAndValidity();

    this.complaintField.setValidators(null);
    this.complaintField.updateValueAndValidity();

    if (this.tasktypeField.value === 1) {
      this.connectionrequestField.setValidators(Validators.required);
      this.connectionrequestField.updateValueAndValidity();
    } else if (this.tasktypeField.value === 2) {
      this.complaintField.setValidators(Validators.required);
      this.complaintField.updateValueAndValidity();
    } else if (this.tasktypeField.value === 3) {
      this.modificationrequestField.setValidators(Validators.required);
      this.modificationrequestField.updateValueAndValidity();
    } else if (this.tasktypeField.value === 4) {
      this.disconnectionrequestField.setValidators(Validators.required);
      this.disconnectionrequestField.updateValueAndValidity();
    } else if (this.tasktypeField.value === 5) {
      this.reconnectionrequestField.setValidators(Validators.required);
      this.reconnectionrequestField.updateValueAndValidity();
    }
  }

  setConnectionValues(): void {
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.connectionrequestField.value.pobox);
    }
    //set data to title field
    if (this.titleField.pristine) {
      this.titleField.setValue(this.connectionrequestField.value.title);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.connectionrequestField.value.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.connectionrequestField.value.gramaniladharidiv.id);
    }
  }


  setComplainValues(): void {
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.complaintField.value.connection.pobox);
    }
    //set data to title field
    if (this.titleField.pristine) {
      this.titleField.setValue(this.complaintField.value.connection.title);
    }
    if (this.streetField.pristine) {
      this.streetField.setValue(this.complaintField.value.connection.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.complaintField.value.connection.gramaniladharidiv.id);
    }
  }

  setReconnectioValues(): void {
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.reconnectionrequestField.value.connection.pobox);
    }
   /* //set data to title field
    if (this.titleField.pristine) {
      this.titleField.setValue(this.reconnectionrequestField.value.title);
    }*/
    if (this.streetField.pristine) {
      this.streetField.setValue(this.reconnectionrequestField.value.connection.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.reconnectionrequestField.value.connection.gramaniladharidiv.id);
    }
  }

  setModificationConnectionValues(): void {
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.modificationrequestField.value.connection.pobox);
    }
   /* //set data to title field
    if (this.titleField.pristine) {
      this.titleField.setValue(this.modificationrequestField.value.title);
    }*/
    if (this.streetField.pristine) {
      this.streetField.setValue(this.modificationrequestField.value.connection.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.modificationrequestField.value.connection.gramaniladharidiv.id);
    }
  }

  setDisconnecionValues(): void {
    if (this.poboxField.pristine) {
      this.poboxField.setValue(this.disconnectionrequestField.value.connection.pobox);
    }/*
    //set data to title field
    if (this.titleField.pristine) {
      this.titleField.setValue(this.disconnectionrequestField.value.title);
    }*/
    if (this.streetField.pristine) {
      this.streetField.setValue(this.disconnectionrequestField.value.connection.street);
    }
    if (this.gramaniladharidivField.pristine) {
      this.gramaniladharidivField.setValue(this.disconnectionrequestField.value.connection.gramaniladharidiv.id);
    }
  }


  setMin(): any {
    return new Date();
  }

  setTitle(complaint: Complaint) {
    if (this.titleField.pristine) {
      this.titleField.setValue(complaint.title);
    }
  }
}
