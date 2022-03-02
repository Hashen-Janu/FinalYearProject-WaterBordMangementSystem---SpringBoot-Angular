import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Itemrecive} from '../../../../entities/itemrecive';
import {ItemreciveService} from '../../../../services/itemrecive.service';

@Component({
  selector: 'app-itemrecive-detail',
  templateUrl: './itemrecive-detail.component.html',
  styleUrls: ['./itemrecive-detail.component.scss']
})
export class ItemreciveDetailComponent extends AbstractComponent implements OnInit {

  itemrecive: Itemrecive;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private itemreciveService: ItemreciveService,
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
      data: {message: this.itemrecive.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.itemreciveService.delete(this.selectedId);
        await this.router.navigateByUrl('/itemrecives');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.itemrecive = await this.itemreciveService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRECIVE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRECIVES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRECIVE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRECIVE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRECIVE);
  }
}
