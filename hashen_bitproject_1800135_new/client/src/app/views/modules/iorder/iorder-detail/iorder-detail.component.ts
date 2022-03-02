import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Iorder} from '../../../../entities/iorder';
import {IorderService} from '../../../../services/iorder.service';

@Component({
  selector: 'app-iorder-detail',
  templateUrl: './iorder-detail.component.html',
  styleUrls: ['./iorder-detail.component.scss']
})
export class IorderDetailComponent extends AbstractComponent implements OnInit {

  iorder: Iorder;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private iorderService: IorderService,
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
      data: {message: this.iorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.iorderService.delete(this.selectedId);
        await this.router.navigateByUrl('/iorders');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.iorder = await this.iorderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_IORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_IORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_IORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_IORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_IORDER);
  }
}
