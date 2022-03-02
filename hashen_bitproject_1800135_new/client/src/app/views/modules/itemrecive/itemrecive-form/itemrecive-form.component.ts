import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Itemrecive} from '../../../../entities/itemrecive';
import {ItemreciveService} from '../../../../services/itemrecive.service';
import {ViewChild} from '@angular/core';
import {Iorder} from '../../../../entities/iorder';
import {DateHelper} from '../../../../shared/date-helper';
import {IorderService} from '../../../../services/iorder.service';
import {ItemreciveitemSubFormComponent} from './itemreciveitem-sub-form/itemreciveitem-sub-form.component';

@Component({
  selector: 'app-itemrecive-form',
  templateUrl: './itemrecive-form.component.html',
  styleUrls: ['./itemrecive-form.component.scss']
})
export class ItemreciveFormComponent extends AbstractComponent implements OnInit {

  iorders: Iorder[] = [];
  @ViewChild(ItemreciveitemSubFormComponent) itemreciveitemSubForm: ItemreciveitemSubFormComponent;

  form = new FormGroup({
    iorder: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    itemreciveitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get iorderField(): FormControl{
    return this.form.controls.iorder as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get itemreciveitemsField(): FormControl{
    return this.form.controls.itemreciveitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private iorderService: IorderService,
    private itemreciveService: ItemreciveService,
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

    this.iorderService.getAllBasic(new PageRequest()).then((iorderDataPage) => {
      this.iorders = iorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRECIVE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRECIVES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRECIVE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRECIVE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRECIVE);
  }

  async submit(): Promise<void> {
    this.itemreciveitemSubForm.resetForm();
    this.itemreciveitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const itemrecive: Itemrecive = new Itemrecive();
    itemrecive.iorder = this.iorderField.value;
    itemrecive.date = DateHelper.getDateAsString(this.dateField.value);
    itemrecive.itemreciveitemList = this.itemreciveitemsField.value;
    itemrecive.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.itemreciveService.add(itemrecive);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/itemrecives/' + resourceLink.id);
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
          if (msg.iorder) { this.iorderField.setErrors({server: msg.iorder}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.itemreciveitemList) { this.itemreciveitemsField.setErrors({server: msg.itemreciveitemList}); knownError = true; }
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
}
