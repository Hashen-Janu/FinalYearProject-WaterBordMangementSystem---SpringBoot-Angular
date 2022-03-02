import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Itemrecive, ItemreciveDataPage} from '../../../../entities/itemrecive';
import {ItemreciveService} from '../../../../services/itemrecive.service';
import {Iorder} from '../../../../entities/iorder';
import {IorderService} from '../../../../services/iorder.service';

@Component({
  selector: 'app-itemrecive-table',
  templateUrl: './itemrecive-table.component.html',
  styleUrls: ['./itemrecive-table.component.scss']
})
export class ItemreciveTableComponent extends AbstractComponent implements OnInit {

  itemreciveDataPage: ItemreciveDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  iorders: Iorder[] = [];

  codeField = new FormControl();
  iorderField = new FormControl();

  constructor(
    private iorderService: IorderService,
    private itemreciveService: ItemreciveService,
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
    pageRequest.addSearchCriteria('iorder', this.iorderField.value);

    this.iorderService.getAllBasic(new PageRequest()).then((iorderDataPage) => {
      this.iorders = iorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.itemreciveService.getAll(pageRequest).then((page: ItemreciveDataPage) => {
      this.itemreciveDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRECIVE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRECIVES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRECIVE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRECIVE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRECIVE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'iorder', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(itemrecive: Itemrecive): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: itemrecive.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.itemreciveService.delete(itemrecive.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
