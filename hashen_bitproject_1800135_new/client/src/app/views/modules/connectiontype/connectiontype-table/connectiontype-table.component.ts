import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Connectiontype, ConnectiontypeDataPage} from '../../../../entities/connectiontype';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';

@Component({
  selector: 'app-connectiontype-table',
  templateUrl: './connectiontype-table.component.html',
  styleUrls: ['./connectiontype-table.component.scss']
})
export class ConnectiontypeTableComponent extends AbstractComponent implements OnInit {

  connectiontypeDataPage: ConnectiontypeDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private connectiontypeService: ConnectiontypeService,
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


    this.connectiontypeService.getAll(pageRequest).then((page: ConnectiontypeDataPage) => {
      this.connectiontypeDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONTYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONTYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONTYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONTYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONTYPE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'fee', 'secdeposit', 'nonrefdeposit'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(connectiontype: Connectiontype): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: connectiontype.code + ' ' + connectiontype.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.connectiontypeService.delete(connectiontype.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
