import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Taskallocation, TaskallocationDataPage} from '../../../../entities/taskallocation';
import {TaskallocationService} from '../../../../services/taskallocation.service';
import {Tasktype} from '../../../../entities/tasktype';
import {TasktypeService} from '../../../../services/tasktype.service';
import {Gramaniladharidiv} from '../../../../entities/gramaniladharidiv';
import {GramaniladharidivService} from '../../../../services/gramaniladharidiv.service';
import {ConfirmDialogComponent} from '../../../../shared/views/confirm-dialog/confirm-dialog.component';
import {Taskallocationstatus} from '../../../../entities/taskallocationstatus';

@Component({
  selector: 'app-taskallocation-table',
  templateUrl: './taskallocation-table.component.html',
  styleUrls: ['./taskallocation-table.component.scss']
})
export class TaskallocationTableComponent extends AbstractComponent implements OnInit {

  taskallocationDataPage: TaskallocationDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  tasktypes: Tasktype[] = [];
  gramaniladharidivs: Gramaniladharidiv[] = [];

  codeField = new FormControl();
  tasktypeField = new FormControl();
  gramaniladharidivField = new FormControl();
  disable: any;

  constructor(
    private tasktypeService: TasktypeService,
    private gramaniladharidivService: GramaniladharidivService,
    private taskallocationService: TaskallocationService,
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
    pageRequest.addSearchCriteria('tasktype', this.tasktypeField.value);
    pageRequest.addSearchCriteria('gramaniladharidiv', this.gramaniladharidivField.value);

    this.tasktypeService.getAll().then((tasktypes) => {
      this.tasktypes = tasktypes;
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

    this.taskallocationService.getAll(pageRequest).then((page: TaskallocationDataPage) => {
      this.taskallocationDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASKALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASKALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASKALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASKALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASKALLOCATION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'time', 'street', 'gramaniladharidiv'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(taskallocation: Taskallocation): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: taskallocation.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.taskallocationService.delete(taskallocation.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

  async done(taskallocation: Taskallocation): Promise<void>{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {message: taskallocation.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.taskallocationService.done(taskallocation.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }


  // done(element: Taskallocation): void{
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '300px',
  //     data: {message: 'Are you sure to done', title: 'Done', color: 'accent'}
  //   });
  //
  //   dialogRef.afterClosed().subscribe( async result => {
  //     if (!result) { return; }
  //     element.taskallocationstatus.id = 2;
  //     await this.taskallocationService.update(element.id, element);
  //     this.loadData();
  //   });
  // }

}
