import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Disposal} from '../../../../entities/disposal';
import {DisposalService} from '../../../../services/disposal.service';

@Component({
  selector: 'app-disposal-detail',
  templateUrl: './disposal-detail.component.html',
  styleUrls: ['./disposal-detail.component.scss']
})
export class DisposalDetailComponent extends AbstractComponent implements OnInit {

  disposal: Disposal;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private disposalService: DisposalService,
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
      data: {message: this.disposal.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.disposalService.delete(this.selectedId);
        await this.router.navigateByUrl('/disposals');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.disposal = await this.disposalService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISPOSAL);
  }
}
