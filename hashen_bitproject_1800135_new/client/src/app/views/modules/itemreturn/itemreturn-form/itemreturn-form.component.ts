import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Itemreturn} from '../../../../entities/itemreturn';
import {ItemreturnService} from '../../../../services/itemreturn.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {ItemreturnitemSubFormComponent} from './itemreturnitem-sub-form/itemreturnitem-sub-form.component';

@Component({
  selector: 'app-itemreturn-form',
  templateUrl: './itemreturn-form.component.html',
  styleUrls: ['./itemreturn-form.component.scss']
})
export class ItemreturnFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(ItemreturnitemSubFormComponent) itemreturnitemSubForm: ItemreturnitemSubFormComponent;

  form = new FormGroup({
    reason: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    itemreturnitems: new FormControl(),
  });

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get itemreturnitemsField(): FormControl{
    return this.form.controls.itemreturnitems as FormControl;
  }

  constructor(
    private itemreturnService: ItemreturnService,
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRETURN);
  }

  async submit(): Promise<void> {
    this.itemreturnitemSubForm.resetForm();
    this.itemreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const itemreturn: Itemreturn = new Itemreturn();
    itemreturn.reason = this.reasonField.value;
    itemreturn.date = DateHelper.getDateAsString(this.dateField.value);
    itemreturn.itemreturnitemList = this.itemreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.itemreturnService.add(itemreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/itemreturns/' + resourceLink.id);
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
          if (msg.reason) { this.reasonField.setErrors({server: msg.reason}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.itemreturnitemList) { this.itemreturnitemsField.setErrors({server: msg.itemreturnitemList}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
