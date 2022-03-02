import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Modificationrequest, ModificationrequestDataPage} from '../../../../entities/modificationrequest';
import {ModificationrequestService} from '../../../../services/modificationrequest.service';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {Modificationrequeststatus} from '../../../../entities/modificationrequeststatus';
import {ModificationrequeststatusService} from '../../../../services/modificationrequeststatus.service';

@Component({
  selector: 'app-modificationrequest-table',
  templateUrl: './modificationrequest-table.component.html',
  styleUrls: ['./modificationrequest-table.component.scss']
})
export class ModificationrequestTableComponent extends AbstractComponent implements OnInit {

  modificationrequestDataPage: ModificationrequestDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  connections: Connection[] = [];
  modificationrequeststatuses: Modificationrequeststatus[] = [];

  codeField = new FormControl();
  connectionField = new FormControl();
  modificationrequeststatusField = new FormControl();

  constructor(
    private connectionService: ConnectionService,
    private modificationrequeststatusService: ModificationrequeststatusService,
    private modificationrequestService: ModificationrequestService,
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
    pageRequest.addSearchCriteria('modificationrequeststatus', this.modificationrequeststatusField.value);

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

    this.modificationrequestService.getAll(pageRequest).then((page: ModificationrequestDataPage) => {
      this.modificationrequestDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'date', 'modificationrequeststatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(modificationrequest: Modificationrequest): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: modificationrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.modificationrequestService.delete(modificationrequest.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
