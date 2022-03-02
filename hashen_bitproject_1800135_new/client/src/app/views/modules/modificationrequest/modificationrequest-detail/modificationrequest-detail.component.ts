import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Modificationrequest} from '../../../../entities/modificationrequest';
import {ModificationrequestService} from '../../../../services/modificationrequest.service';

@Component({
  selector: 'app-modificationrequest-detail',
  templateUrl: './modificationrequest-detail.component.html',
  styleUrls: ['./modificationrequest-detail.component.scss']
})
export class ModificationrequestDetailComponent extends AbstractComponent implements OnInit {

  modificationrequest: Modificationrequest;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private modificationrequestService: ModificationrequestService,
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
      data: {message: this.modificationrequest.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.modificationrequestService.delete(this.selectedId);
        await this.router.navigateByUrl('/modificationrequests');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.modificationrequest = await this.modificationrequestService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MODIFICATIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MODIFICATIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MODIFICATIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MODIFICATIONREQUEST);
  }
}
