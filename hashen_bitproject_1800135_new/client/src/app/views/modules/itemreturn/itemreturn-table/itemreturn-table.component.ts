import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Itemreturn, ItemreturnDataPage} from '../../../../entities/itemreturn';
import {ItemreturnService} from '../../../../services/itemreturn.service';

@Component({
  selector: 'app-itemreturn-table',
  templateUrl: './itemreturn-table.component.html',
  styleUrls: ['./itemreturn-table.component.scss']
})
export class ItemreturnTableComponent extends AbstractComponent implements OnInit {

  itemreturnDataPage: ItemreturnDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private itemreturnService: ItemreturnService,
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


    this.itemreturnService.getAll(pageRequest).then((page: ItemreturnDataPage) => {
      this.itemreturnDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRETURN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(itemreturn: Itemreturn): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: itemreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.itemreturnService.delete(itemreturn.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
