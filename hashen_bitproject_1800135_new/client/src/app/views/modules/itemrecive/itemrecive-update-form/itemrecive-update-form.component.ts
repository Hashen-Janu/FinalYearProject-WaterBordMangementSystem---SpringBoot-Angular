import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Itemrecive} from '../../../../entities/itemrecive';
import {ItemreciveService} from '../../../../services/itemrecive.service';
import {ViewChild} from '@angular/core';
import {Iorder} from '../../../../entities/iorder';
import {DateHelper} from '../../../../shared/date-helper';
import {IorderService} from '../../../../services/iorder.service';
import {ItemreciveitemUpdateSubFormComponent} from './itemreciveitem-update-sub-form/itemreciveitem-update-sub-form.component';

@Component({
  selector: 'app-itemrecive-update-form',
  templateUrl: './itemrecive-update-form.component.html',
  styleUrls: ['./itemrecive-update-form.component.scss']
})
export class ItemreciveUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  itemrecive: Itemrecive;

  iorders: Iorder[] = [];
  @ViewChild(ItemreciveitemUpdateSubFormComponent) itemreciveitemUpdateSubForm: ItemreciveitemUpdateSubFormComponent;

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

    this.iorderService.getAllBasic(new PageRequest()).then((iorderDataPage) => {
      this.iorders = iorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.itemrecive = await this.itemreciveService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEMRECIVE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMRECIVES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEMRECIVE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEMRECIVE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEMRECIVE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.iorderField.pristine) {
      this.iorderField.setValue(this.itemrecive.iorder.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.itemrecive.date);
    }
    if (this.itemreciveitemsField.pristine) {
      this.itemreciveitemsField.setValue(this.itemrecive.itemreciveitemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.itemrecive.description);
    }
}

  async submit(): Promise<void> {
    this.itemreciveitemUpdateSubForm.resetForm();
    this.itemreciveitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newitemrecive: Itemrecive = new Itemrecive();
    newitemrecive.iorder = this.iorderField.value;
    newitemrecive.date = DateHelper.getDateAsString(this.dateField.value);
    newitemrecive.itemreciveitemList = this.itemreciveitemsField.value;
    newitemrecive.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.itemreciveService.update(this.selectedId, newitemrecive);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/itemrecives/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/itemrecives');
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
