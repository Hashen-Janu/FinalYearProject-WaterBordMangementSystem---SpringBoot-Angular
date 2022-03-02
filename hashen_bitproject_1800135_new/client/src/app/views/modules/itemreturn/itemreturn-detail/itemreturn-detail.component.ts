import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Itemreturn} from '../../../../entities/itemreturn';
import {ItemreturnService} from '../../../../services/itemreturn.service';

@Component({
  selector: 'app-itemreturn-detail',
  templateUrl: './itemreturn-detail.component.html',
  styleUrls: ['./itemreturn-detail.component.scss']
})
export class ItemreturnDetailComponent extends AbstractComponent implements OnInit {

  itemreturn: Itemreturn;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private itemreturnService: ItemreturnService,
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
      data: {message: this.itemreturn.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.itemreturnService.delete(this.selectedId);
        await this.router.navigateByUrl('/itemreturns');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.itemreturn = await this.itemreturnService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRETURN);
  }
}
