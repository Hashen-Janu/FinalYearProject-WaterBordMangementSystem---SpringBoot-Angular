import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Taskallocation} from '../../../../entities/taskallocation';
import {TaskallocationService} from '../../../../services/taskallocation.service';

@Component({
  selector: 'app-taskallocation-detail',
  templateUrl: './taskallocation-detail.component.html',
  styleUrls: ['./taskallocation-detail.component.scss']
})
export class TaskallocationDetailComponent extends AbstractComponent implements OnInit {

  taskallocation: Taskallocation;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private taskallocationService: TaskallocationService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.taskallocation.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.taskallocationService.delete(this.selectedId);
        await this.router.navigateByUrl('/taskallocations');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.taskallocation = await this.taskallocationService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TASKALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TASKALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TASKALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TASKALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TASKALLOCATION);
  }
}
