import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Connectionrequest, ConnectionrequestDataPage} from '../../../../entities/connectionrequest';
import {ConnectionrequestService} from '../../../../services/connectionrequest.service';
import {Consumer} from '../../../../entities/consumer';
import {Placetype} from '../../../../entities/placetype';
import {ConsumerService} from '../../../../services/consumer.service';
import {PlacetypeService} from '../../../../services/placetype.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';

@Component({
  selector: 'app-connectionrequest-table',
  templateUrl: './connectionrequest-table.component.html',
  styleUrls: ['./connectionrequest-table.component.scss']
})
export class ConnectionrequestTableComponent extends AbstractComponent implements OnInit {

  connectionrequestDataPage: ConnectionrequestDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  consumers: Consumer[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];
  placetypes: Placetype[] = [];

  codeField = new FormControl();
  consumerField = new FormControl();
  streetField = new FormControl();
  gramaniladharidivField = new FormControl();
  placetypeField = new FormControl();

  constructor(
    private consumerService: ConsumerService,
    private gramaniladharidivService: GramaniladharidivService,
    private placetypeService: PlacetypeService,
    private connectionrequestService: ConnectionrequestService,
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
    pageRequest.addSearchCriteria('consumer', this.consumerField.value);
    pageRequest.addSearchCriteria('street', this.streetField.value);
    pageRequest.addSearchCriteria('gramaniladharidiv', this.gramaniladharidivField.value);
    pageRequest.addSearchCriteria('placetype', this.placetypeField.value);

    this.consumerService.getAllBasic(new PageRequest()).then((consumerDataPage) => {
      this.consumers = consumerDataPage.content;
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
    this.placetypeService.getAll().then((placetypes) => {
      this.placetypes = placetypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.connectionrequestService.getAll(pageRequest).then((page: ConnectionrequestDataPage) => {
      this.connectionrequestDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONREQUEST);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'consumer', 'street', 'gramaniladharidiv', 'appicationfee', 'connectionfee', 'laborcost', 'placetype', 'payslip'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(connectionrequest: Connectionrequest): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: connectionrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.connectionrequestService.delete(connectionrequest.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
