import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Disposal} from '../../../../entities/disposal';
import {DisposalService} from '../../../../services/disposal.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {DisposalitemSubFormComponent} from './disposalitem-sub-form/disposalitem-sub-form.component';

@Component({
  selector: 'app-disposal-form',
  templateUrl: './disposal-form.component.html',
  styleUrls: ['./disposal-form.component.scss']
})
export class DisposalFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(DisposalitemSubFormComponent) disposalitemSubForm: DisposalitemSubFormComponent;

  form = new FormGroup({
    reason: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    disposalitems: new FormControl(),
  });

  get reasonField(): FormControl{
    return this.form.controls.reason as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get disposalitemsField(): FormControl{
    return this.form.controls.disposalitems as FormControl;
  }

  constructor(
    private disposalService: DisposalService,
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISPOSAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISPOSALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISPOSAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISPOSAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISPOSAL);
  }

  async submit(): Promise<void> {
    this.disposalitemSubForm.resetForm();
    this.disposalitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const disposal: Disposal = new Disposal();
    disposal.reason = this.reasonField.value;
    disposal.date = DateHelper.getDateAsString(this.dateField.value);
    disposal.disposalitemList = this.disposalitemsField.value;
    try{
      const resourceLink: ResourceLink = await this.disposalService.add(disposal);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/disposals/' + resourceLink.id);
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
          if (msg.disposalitemList) { this.disposalitemsField.setErrors({server: msg.disposalitemList}); knownError = true; }
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
