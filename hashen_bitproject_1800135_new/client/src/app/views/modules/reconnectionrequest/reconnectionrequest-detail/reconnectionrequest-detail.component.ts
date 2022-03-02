import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Reconnectionrequest} from '../../../../entities/reconnectionrequest';
import {ReconnectionrequestService} from '../../../../services/reconnectionrequest.service';

@Component({
  selector: 'app-reconnectionrequest-detail',
  templateUrl: './reconnectionrequest-detail.component.html',
  styleUrls: ['./reconnectionrequest-detail.component.scss']
})
export class ReconnectionrequestDetailComponent extends AbstractComponent implements OnInit {

  reconnectionrequest: Reconnectionrequest;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private reconnectionrequestService: ReconnectionrequestService,
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
      data: {message: this.reconnectionrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.reconnectionrequestService.delete(this.selectedId);
        await this.router.navigateByUrl('/reconnectionrequests');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.reconnectionrequest = await this.reconnectionrequestService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RECONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RECONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RECONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RECONNECTIONREQUEST);
  }
}
