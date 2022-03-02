import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';

@Component({
  selector: 'app-item-update-form',
  templateUrl: './item-update-form.component.html',
  styleUrls: ['./item-update-form.component.scss']
})
export class ItemUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  item: Item;


  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(2000),
      Validators.pattern('^([0-9]*)$'),
    ]),
    rop: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(2000),
      Validators.pattern('^([0-9]*)$'),
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get priceField(): FormControl{
    return this.form.controls.price as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get ropField(): FormControl{
    return this.form.controls.rop as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private itemService: ItemService,
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

    this.item = await this.itemService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.item.name);
    }
    if (this.priceField.pristine) {
      this.priceField.setValue(this.item.price);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.item.qty);
    }
    if (this.ropField.pristine) {
      this.ropField.setValue(this.item.rop);
    }
    if (this.photoField.pristine) {
      if (this.item.photo) { this.photoField.setValue([this.item.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.item.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newitem: Item = new Item();
    newitem.name = this.nameField.value;
    newitem.price = this.priceField.value;
    newitem.qty = this.qtyField.value;
    newitem.rop = this.ropField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newitem.photo = photoIds[0];
    }else{
      newitem.photo = null;
    }
    newitem.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.itemService.update(this.selectedId, newitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/items/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/items');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.price) { this.priceField.setErrors({server: msg.price}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.rop) { this.ropField.setErrors({server: msg.rop}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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
