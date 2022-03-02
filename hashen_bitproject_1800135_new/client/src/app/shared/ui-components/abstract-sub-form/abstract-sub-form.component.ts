import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../views/confirm-dialog/confirm-dialog.component';

@Component({
  template: '',
  styleUrls: ['./abstract-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AbstractSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AbstractSubFormComponent),
      multi: true,
    }
  ]
})
export abstract class AbstractSubFormComponent<T> implements OnInit, ControlValueAccessor  {

  protected constructor() {}

  get dataList(): T[]{
    return this._dataList;
  }

  set dataList(dataList: T[]){
    this._dataList = dataList;
  }

  get value(): T[]{
    return this.dataList;
  }

  set isDisabled(isDisabled: boolean){
    this.disabled = isDisabled;
  }

  get isDisabled(): boolean{
    return this.disabled;
  }

  abstract get isFormEmpty(): boolean;

  public change: (value: any) => void;
  public touched: () => void;
  private _dataList: T[] = [];
  @Input()
  public disabled: boolean;
  @Input()
  public max = 0;
  @Input()
  public min = 0;
  protected dialog: MatDialog;
  public validatorChange = () => {};
  abstract getDeleteConfirmMessage(dataItem: T): string;
  abstract getUpdateConfirmMessage(dataItem: T): string;
  abstract customValidations(): object;
  abstract fillForm(dataItem: T): void;
  abstract addData(): void;

  ngOnInit(): void {

  }

  protected isEmptyField(field: FormControl): boolean{
    return field.value === '' || field.value === null;
  }

  removeData(index: number, dataItem: T): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        message: this.getDeleteConfirmMessage(dataItem),
        title: 'Remove',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      this.removeFromIndex(index);
    });

  }

  updateData(index: number, dataItem: T): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {message: this.getUpdateConfirmMessage(dataItem), title: 'Update', color: 'accent'}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      this.fillForm(dataItem);
      this.removeFromIndex(index);
    });
  }

  registerOnChange(fn: any): void {
    this.change = fn;
  }

  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  writeValue(dataList: T[]): void {
    // @ts-ignore
    if (dataList === '') {
      console.error();
      return;
    }
    if (dataList === null) { dataList = []; }
    this.dataList = dataList;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.validatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    let valid = true;
    let errors = {};

    if (this.max > 0 && this.max < this.dataList.length){
      valid = false;
      errors = {...errors, max: true};
    }

    if (this.min > 0 && this.min > this.dataList.length){
      valid = false;
      errors = {...errors, min: true};
    }

    const customErrors = this.customValidations();

    if (customErrors !== null){
      valid = false;
      errors = {...errors, ...customErrors};
    }

    return valid ? null : errors;
  }

  addToTop(dataItem: T): void{
    this.dataList.unshift(dataItem);
    this.change(this.dataList);
    this.validatorChange();
  }

  addToBottom(dataItem: T): void{
    this.dataList.push(dataItem);
    this.change(this.dataList);
    this.validatorChange();
  }

  removeFromIndex(index: number): void{
    this.dataList.splice(index, 1);
    this.change(this.dataList);
    this.validatorChange();
  }

}
