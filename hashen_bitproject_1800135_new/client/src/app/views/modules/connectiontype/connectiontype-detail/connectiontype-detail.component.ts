import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Connectiontype} from '../../../../entities/connectiontype';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';

@Component({
  selector: 'app-connectiontype-detail',
  templateUrl: './connectiontype-detail.component.html',
  styleUrls: ['./connectiontype-detail.component.scss']
})
export class ConnectiontypeDetailComponent extends AbstractComponent implements OnInit {

  connectiontype: Connectiontype;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private connectiontypeService: ConnectiontypeService,
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
      data: {message: this.connectiontype.code + ' ' + this.connectiontype.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.connectiontypeService.delete(this.selectedId);
        await this.router.navigateByUrl('/connectiontypes');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.connectiontype = await this.connectiontypeService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONTYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONTYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONTYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONTYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONTYPE);
  }
}
