import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Iorder} from '../../../../entities/iorder';
import {IorderService} from '../../../../services/iorder.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {OrderitemSubFormComponent} from './orderitem-sub-form/orderitem-sub-form.component';

@Component({
  selector: 'app-iorder-form',
  templateUrl: './iorder-form.component.html',
  styleUrls: ['./iorder-form.component.scss']
})
export class IorderFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(OrderitemSubFormComponent) orderitemSubForm: OrderitemSubFormComponent;

  form = new FormGroup({

    dorequired: new FormControl(null, [
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

  get orderitemsField(): FormControl{
    return this.form.controls.orderitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private iorderService: IorderService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_IORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_IORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_IORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_IORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_IORDER);
  }

  async submit(): Promise<void> {
    this.orderitemSubForm.resetForm();
    this.orderitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const iorder: Iorder = new Iorder();
    iorder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    iorder.orderitemList = this.orderitemsField.value;
    iorder.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.iorderService.add(iorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/iorders/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.dorequired) { this.dorequiredField.setErrors({server: msg.dorequired}); knownError = true; }
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
