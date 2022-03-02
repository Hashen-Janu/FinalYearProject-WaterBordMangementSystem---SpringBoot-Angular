import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Discount} from '../../../../entities/discount';
import {DiscountService} from '../../../../services/discount.service';
import {Discounttype} from '../../../../entities/discounttype';
import {Discountstatus} from '../../../../entities/discountstatus';
import {Connectiontype} from '../../../../entities/connectiontype';
import {DiscounttypeService} from '../../../../services/discounttype.service';
import {DiscountstatusService} from '../../../../services/discountstatus.service';
import {ConnectiontypeService} from '../../../../services/connectiontype.service';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.scss']
})
export class DiscountFormComponent extends AbstractComponent implements OnInit {

  discountstatuses: Discountstatus[] = [];
  discounttypes: Discounttype[] = [];
  connectiontypes: Connectiontype[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    discountstatus: new FormControl(null, [
    ]),
    discounttype: new FormControl(null, [
    ]),
    value: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    connectiontypes: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get discountstatusField(): FormControl{
    return this.form.controls.discountstatus as FormControl;
  }

  get discounttypeField(): FormControl{
    return this.form.controls.discounttype as FormControl;
  }

  get valueField(): FormControl{
    return this.form.controls.value as FormControl;
  }

  get connectiontypesField(): FormControl{
    return this.form.controls.connectiontypes as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private discountstatusService: DiscountstatusService,
    private discounttypeService: DiscounttypeService,
    private connectiontypeService: ConnectiontypeService,
    private discountService: DiscountService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.connectiontypeService.getAllBasic(new PageRequest()).then((connectiontypeDataPage) => {
      this.connectiontypes = connectiontypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.discountstatusService.getAll().then((discountstatuses) => {
      this.discountstatuses = discountstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.discounttypeService.getAll().then((discounttypes) => {
      this.discounttypes = discounttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCOUNT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCOUNTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCOUNT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCOUNT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCOUNT);
  }

  async submit(): Promise<void> {
    this.connectiontypesField.updateValueAndValidity();
    this.connectiontypesField.markAsTouched();
    if (this.form.invalid) { return; }

    const discount: Discount = new Discount();
    discount.name = this.nameField.value;
    discount.discountstatus = this.discountstatusField.value;
    discount.discounttype = this.discounttypeField.value;
    discount.value = this.valueField.value;
    discount.connectiontypeList = this.connectiontypesField.value;
    discount.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.discountService.add(discount);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/discounts/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.discountstatus) { this.discountstatusField.setErrors({server: msg.discountstatus}); knownError = true; }
          if (msg.discounttype) { this.discounttypeField.setErrors({server: msg.discounttype}); knownError = true; }
          if (msg.value) { this.valueField.setErrors({server: msg.value}); knownError = true; }
          if (msg.connectiontypeList) { this.connectiontypesField.setErrors({server: msg.connectiontypeList}); knownError = true; }
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
