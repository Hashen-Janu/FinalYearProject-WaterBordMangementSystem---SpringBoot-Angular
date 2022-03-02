import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Iorder, IorderDataPage} from '../../../../entities/iorder';
import {IorderService} from '../../../../services/iorder.service';
import {Iorderstatus} from '../../../../entities/iorderstatus';
import {IorderstatusService} from '../../../../services/iorderstatus.service';

@Component({
  selector: 'app-iorder-table',
  templateUrl: './iorder-table.component.html',
  styleUrls: ['./iorder-table.component.scss']
})
export class IorderTableComponent extends AbstractComponent implements OnInit {

  iorderDataPage: IorderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  iorderstatuses: Iorderstatus[] = [];

  codeField = new FormControl();
  iorderstatusField = new FormControl();

  constructor(
    private iorderstatusService: IorderstatusService,
    private iorderService: IorderService,
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
    pageRequest.addSearchCriteria('iorderstatus', this.iorderstatusField.value);

    this.iorderstatusService.getAll().then((iorderstatuses) => {
      this.iorderstatuses = iorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.iorderService.getAll(pageRequest).then((page: IorderDataPage) => {
      this.iorderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_IORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_IORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_IORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_IORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_IORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'doordered', 'dorequired', 'iorderstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(iorder: Iorder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: iorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.iorderService.delete(iorder.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
