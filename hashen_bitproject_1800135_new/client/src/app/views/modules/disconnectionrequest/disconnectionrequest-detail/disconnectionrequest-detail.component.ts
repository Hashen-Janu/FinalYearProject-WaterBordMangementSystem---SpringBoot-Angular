import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Disconnectionrequest} from '../../../../entities/disconnectionrequest';
import {DisconnectionrequestService} from '../../../../services/disconnectionrequest.service';

@Component({
  selector: 'app-disconnectionrequest-detail',
  templateUrl: './disconnectionrequest-detail.component.html',
  styleUrls: ['./disconnectionrequest-detail.component.scss']
})
export class DisconnectionrequestDetailComponent extends AbstractComponent implements OnInit {

  disconnectionrequest: Disconnectionrequest;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private disconnectionrequestService: DisconnectionrequestService,
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
      data: {message: this.disconnectionrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.disconnectionrequestService.delete(this.selectedId);
        await this.router.navigateByUrl('/disconnectionrequests');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.disconnectionrequest = await this.disconnectionrequestService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCONNECTIONREQUEST);
  }
}
