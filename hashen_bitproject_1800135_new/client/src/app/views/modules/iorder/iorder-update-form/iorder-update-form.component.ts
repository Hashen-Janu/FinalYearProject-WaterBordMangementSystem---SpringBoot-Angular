import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Iorder} from '../../../../entities/iorder';
import {IorderService} from '../../../../services/iorder.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Iorderstatus} from '../../../../entities/iorderstatus';
import {IorderstatusService} from '../../../../services/iorderstatus.service';
import {OrderitemUpdateSubFormComponent} from './orderitem-update-sub-form/orderitem-update-sub-form.component';

@Component({
  selector: 'app-iorder-update-form',
  templateUrl: './iorder-update-form.component.html',
  styleUrls: ['./iorder-update-form.component.scss']
})
export class IorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  iorder: Iorder;

  iorderstatuses: Iorderstatus[] = [];
  @ViewChild(OrderitemUpdateSubFormComponent) orderitemUpdateSubForm: OrderitemUpdateSubFormComponent;

  form = new FormGroup({

    dorequired: new FormControl(null, [
      Validators.required,
    ]),
    dorecived: new FormControl(null, [
      Validators.required,
    ]),
    iorderstatus: new FormControl('1', [
      Validators.required,
    ]),
    orderitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });



  get dorequiredField(): FormControl{
    return this.form.controls.dorequired as FormControl;
  }

  get dorecivedField(): FormControl{
    return this.form.controls.dorecived as FormControl;
  }

  get iorderstatusField(): FormControl{
    return this.form.controls.iorderstatus as FormControl;
  }

  get orderitemsField(): FormControl{
    return this.form.controls.orderitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private iorderstatusService: IorderstatusService,
    private iorderService: IorderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.iorderstatusService.getAll().then((iorderstatuses) => {
      this.iorderstatuses = iorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.iorder = await this.iorderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_IORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_IORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_IORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_IORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_IORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{

    if (this.dorequiredField.pristine) {
      this.dorequiredField.setValue(this.iorder.dorequired);
    }
    if (this.dorecivedField.pristine) {
      this.dorecivedField.setValue(this.iorder.dorecived);
    }
    if (this.iorderstatusField.pristine) {
      this.iorderstatusField.setValue(this.iorder.iorderstatus.id);
    }
    if (this.orderitemsField.pristine) {
      this.orderitemsField.setValue(this.iorder.orderitemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.iorder.description);
    }
}

  async submit(): Promise<void> {
    this.orderitemUpdateSubForm.resetForm();
    this.orderitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newiorder: Iorder = new Iorder();
    newiorder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    newiorder.dorecived = DateHelper.getDateAsString(this.dorecivedField.value);
    newiorder.iorderstatus = this.iorderstatusField.value;
    newiorder.orderitemList = this.orderitemsField.value;
    newiorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.iorderService.update(this.selectedId, newiorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/iorders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/iorders');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
          if (msg.dorecived) { this.dorecivedField.setErrors({server: msg.dorecived}); knownError = true; }
          if (msg.iorderstatus) { this.iorderstatusField.setErrors({server: msg.iorderstatus}); knownError = true; }
          if (msg.orderitemList) { this.orderitemsField.setErrors({server: msg.orderitemList}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
  getDate(): any {
    return new Date();
  }
}
