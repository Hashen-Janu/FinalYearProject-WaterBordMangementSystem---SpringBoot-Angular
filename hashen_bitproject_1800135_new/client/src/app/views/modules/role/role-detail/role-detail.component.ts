import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Role} from '../../../../entities/role';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RoleService} from '../../../../services/role.service';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {User} from '../../../../entities/user';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent extends AbstractComponent implements OnInit {

  role: Role;
  selectedId: number;

  get creator(): string{
    return User.getDisplayName(this.role.creator);
  }

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private roleService: RoleService,
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
      data: {message: this.role.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.roleService.delete(this.role.id);
        await this.router.navigateByUrl('/roles');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.role = await this.roleService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ROLE);
  }

}
