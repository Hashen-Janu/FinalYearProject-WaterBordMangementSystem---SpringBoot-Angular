import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Connectionrequest} from '../../../../entities/connectionrequest';
import {ConnectionrequestService} from '../../../../services/connectionrequest.service';
import {Connectionitem} from '../../../../entities/connectionitem';
import {ReportHelper} from '../../../../shared/report-helper';

@Component({
  selector: 'app-connectionrequest-detail',
  templateUrl: './connectionrequest-detail.component.html',
  styleUrls: ['./connectionrequest-detail.component.scss']
})
export class ConnectionrequestDetailComponent extends AbstractComponent implements OnInit {

  connectionrequest: Connectionrequest;
  selectedId: number;

  payslip: string = null;
  total = 0;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private connectionrequestService: ConnectionrequestService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      try {
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.connectionrequest.code}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      try {
        await this.connectionrequestService.delete(this.selectedId);
        await this.router.navigateByUrl('/connectionrequests');
      } catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.connectionrequest = await this.connectionrequestService.get(this.selectedId);

    if (this.connectionrequest.payslip == null) {
      this.payslip = null;
    } else {
      const photoObject = await this.connectionrequestService.getPayslip(this.selectedId)
      ;
      this.payslip = photoObject.file;
    }
    this.calculate();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONNECTIONREQUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONNECTIONREQUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONNECTIONREQUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONNECTIONREQUEST);
  }

  calculate(): void {
    this.total = 0;
    this.total += parseFloat(String(this.connectionrequest.connectiontype.fee));
    this.total += parseFloat(String(this.connectionrequest.laborcost));
    this.total += parseFloat(String(this.connectionrequest.appicationfee));
    this.total += parseFloat(String(this.connectionrequest.vat));
    console.log(this.total);
    if (this.connectionrequest.discountList != null) {
      console.log(this.total);
      this.connectionrequest.discountList.forEach(discount => {
        this.total -= parseFloat(String(discount.value));
        console.log(this.total);
      });
    }

  }

  print(): void{
    ReportHelper.print('yearWiseConnectionReport');
  }
}
