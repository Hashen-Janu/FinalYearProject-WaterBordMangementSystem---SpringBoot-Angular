import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumer} from '../../../../entities/consumer';
import {ConsumerService} from '../../../../services/consumer.service';
import {Connection} from '../../../../entities/connection';
import {ConnectionService} from '../../../../services/connection.service';
import {PageRequest} from '../../../../shared/page-request';

@Component({
  selector: 'app-consumer-detail',
  templateUrl: './consumer-detail.component.html',
  styleUrls: ['./consumer-detail.component.scss']
})
export class ConsumerDetailComponent extends AbstractComponent implements OnInit {

  consumer: Consumer;
  selectedId: number;
  landdeedphoto: string = null;
  grcphoto: string = null;
  connections: Connection[] = [];


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private consumerService: ConsumerService,
    private connectionService: ConnectionService,
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
    this.refreshRate = 10000;
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.consumer.code + ' ' + this.consumer.firstname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.consumerService.delete(this.selectedId);
        await this.router.navigateByUrl('/consumers');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.consumer = await this.consumerService.get(this.selectedId);

    this.connectionService.getAllByConsumer(this.consumer.id).then((connectionDataPage) => {
      this.connections = connectionDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    if (this.consumer.landdeedphoto == null) {
      this.landdeedphoto = null;
    } else {
      const photoObject = await this.consumerService.getLanddeedphoto(this.selectedId)
      ;
      this.landdeedphoto = photoObject.file;
    }

    if (this.consumer.grcphoto == null) {
      this.grcphoto = null;
    } else {
      const photoObject = await this.consumerService.getGrcphoto(this.selectedId)
      ;
      this.grcphoto = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMER);
  }
}
