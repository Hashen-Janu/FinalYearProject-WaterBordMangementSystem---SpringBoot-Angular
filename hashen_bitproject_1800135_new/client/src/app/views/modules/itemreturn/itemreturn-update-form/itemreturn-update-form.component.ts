import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Itemreturn} from '../../../../entities/itemreturn';
import {ItemreturnService} from '../../../../services/itemreturn.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {ItemreturnitemUpdateSubFormComponent} from './itemreturnitem-update-sub-form/itemreturnitem-update-sub-form.component';

@Component({
  selector: 'app-itemreturn-update-form',
  templateUrl: './itemreturn-update-form.component.html',
  styleUrls: ['./itemreturn-update-form.component.scss']
})
export class ItemreturnUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  itemreturn: Itemreturn;

  @ViewChild(ItemreturnitemUpdateSubFormComponent) itemreturnitemUpdateSubForm: ItemreturnitemUpdateSubFormComponent;

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

    this.itemreturn = await this.itemreturnService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRETURN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRETURNS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRETURN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRETURN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRETURN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.reasonField.pristine) {
      this.reasonField.setValue(this.itemreturn.reason);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.itemreturn.date);
    }
    if (this.itemreturnitemsField.pristine) {
      this.itemreturnitemsField.setValue(this.itemreturn.itemreturnitemList);
    }
}

  async submit(): Promise<void> {
    this.itemreturnitemUpdateSubForm.resetForm();
    this.itemreturnitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newitemreturn: Itemreturn = new Itemreturn();
    newitemreturn.reason = this.reasonField.value;
    newitemreturn.date = DateHelper.getDateAsString(this.dateField.value);
    newitemreturn.itemreturnitemList = this.itemreturnitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.itemreturnService.update(this.selectedId, newitemreturn);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/itemreturns/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/itemreturns');
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
