import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Reconnectionrequest, ReconnectionrequestDataPage} from '../../../../entities/reconnectionrequest';
import {ReconnectionrequestService} from '../../../../services/reconnectionrequest.service';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Reconnectionrequeststatus} from '../../../../entities/reconnectionrequeststatus';
import {ReconnectionrequeststatusService} from '../../../../services/reconnectionrequeststatus.service';

@Component({
  selector: 'app-reconnectionrequest-table',
  templateUrl: './reconnectionrequest-table.component.html',
  styleUrls: ['./reconnectionrequest-table.component.scss']
})
export class ReconnectionrequestTableComponent extends AbstractComponent implements OnInit {

  reconnectionrequestDataPage: ReconnectionrequestDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  connections: Connection[] = [];
  reconnectionrequeststatuses: Reconnectionrequeststatus[] = [];

  codeField = new FormControl();
  connectionField = new FormControl();
  reconnectionrequeststatusField = new FormControl();

  constructor(
    private connectionService: ConnectionService,
    private reconnectionrequeststatusService: ReconnectionrequeststatusService,
    private reconnectionrequestService: ReconnectionrequestService,
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
    pageRequest.addSearchCriteria('reconnectionrequeststatus', this.reconnectionrequeststatusField.value);

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

    this.reconnectionrequestService.getAll(pageRequest).then((page: ReconnectionrequestDataPage) => {
      this.reconnectionrequestDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RECONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RECONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RECONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RECONNECTIONREQUEST);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'date', 'reconnectionrequeststatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(reconnectionrequest: Reconnectionrequest): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: reconnectionrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.reconnectionrequestService.delete(reconnectionrequest.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
