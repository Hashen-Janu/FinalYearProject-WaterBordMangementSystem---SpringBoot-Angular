import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Complaint, ComplaintDataPage} from '../../../../entities/complaint';
import {ComplaintService} from '../../../../services/complaint.service';
import {Connection} from '../../../../entities/connection';
import {Complainttype} from '../../../../entities/complainttype';
import {Complaintstatus} from '../../../../entities/complaintstatus';
import {ConnectionService} from '../../../../services/connection.service';
import {ComplainttypeService} from '../../../../services/complainttype.service';
import {ComplaintstatusService} from '../../../../services/complaintstatus.service';

@Component({
  selector: 'app-complaint-table',
  templateUrl: './complaint-table.component.html',
  styleUrls: ['./complaint-table.component.scss']
})
export class ComplaintTableComponent extends AbstractComponent implements OnInit {

  complaintDataPage: ComplaintDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  connections: Connection[] = [];
  complainttypes: Complainttype[] = [];
  complaintstatuses: Complaintstatus[] = [];

  codeField = new FormControl();
  connectionField = new FormControl();
  complainttypeField = new FormControl();
  complaintstatusField = new FormControl();

  constructor(
    private connectionService: ConnectionService,
    private complainttypeService: ComplainttypeService,
    private complaintstatusService: ComplaintstatusService,
    private complaintService: ComplaintService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('connection', this.connectionField.value);
    pageRequest.addSearchCriteria('complainttype', this.complainttypeField.value);
    pageRequest.addSearchCriteria('complaintstatus', this.complaintstatusField.value);

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

    this.complaintService.getAll(pageRequest).then((page: ComplaintDataPage) => {
      this.complaintDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'connection', 'date', 'complaintstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(complaint: Complaint): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: complaint.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.complaintService.delete(complaint.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
