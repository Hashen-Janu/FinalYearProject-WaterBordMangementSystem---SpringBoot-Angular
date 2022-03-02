import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Disconnectionrequest, DisconnectionrequestDataPage} from '../../../../entities/disconnectionrequest';
import {DisconnectionrequestService} from '../../../../services/disconnectionrequest.service';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';

@Component({
  selector: 'app-disconnectionrequest-table',
  templateUrl: './disconnectionrequest-table.component.html',
  styleUrls: ['./disconnectionrequest-table.component.scss']
})
export class DisconnectionrequestTableComponent extends AbstractComponent implements OnInit {

  disconnectionrequestDataPage: DisconnectionrequestDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  connections: Connection[] = [];

  codeField = new FormControl();
  connectionField = new FormControl();

  constructor(
    private connectionService: ConnectionService,
    private disconnectionrequestService: DisconnectionrequestService,
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

    this.connectionService.getAllBasic(new PageRequest()).then((connectionDataPage) => {
      this.connections = connectionDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.disconnectionrequestService.getAll(pageRequest).then((page: DisconnectionrequestDataPage) => {
      this.disconnectionrequestDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'connection', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(disconnectionrequest: Disconnectionrequest): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: disconnectionrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.disconnectionrequestService.delete(disconnectionrequest.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
