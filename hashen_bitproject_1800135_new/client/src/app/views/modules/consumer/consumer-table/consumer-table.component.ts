import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumer, ConsumerDataPage} from '../../../../entities/consumer';
import {ConsumerService} from '../../../../services/consumer.service';
import {Consumertype} from '../../../../entities/consumertype';
import {ConsumertypeService} from '../../../../services/consumertype.service';

@Component({
  selector: 'app-consumer-table',
  templateUrl: './consumer-table.component.html',
  styleUrls: ['./consumer-table.component.scss']
})
export class ConsumerTableComponent extends AbstractComponent implements OnInit {

  consumerDataPage: ConsumerDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  consumertypes: Consumertype[] = [];

  codeField = new FormControl();
  consumertypeField = new FormControl();
  firstnameField = new FormControl();
  nicField = new FormControl();

  constructor(
    private consumertypeService: ConsumertypeService,
    private consumerService: ConsumerService,
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
    pageRequest.addSearchCriteria('consumertype', this.consumertypeField.value);
    pageRequest.addSearchCriteria('firstname', this.firstnameField.value);
    pageRequest.addSearchCriteria('nic', this.nicField.value);

    this.consumertypeService.getAll().then((consumertypes) => {
      this.consumertypes = consumertypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.consumerService.getAll(pageRequest).then((page: ConsumerDataPage) => {
      this.consumerDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'consumertype', 'firstname', 'nic'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(consumer: Consumer): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: consumer.code + ' ' + consumer.firstname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.consumerService.delete(consumer.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
