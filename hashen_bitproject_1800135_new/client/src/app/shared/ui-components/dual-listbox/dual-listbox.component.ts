// tslint:disable
import {Component, forwardRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from '@angular/forms';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DualListboxComponent),
      multi: true
    }, {
      provide: MatFormFieldControl,
      useExisting: DualListboxComponent,
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DualListboxComponent),
      multi: true,
    }
  ]
})
export class DualListboxComponent implements MatFormFieldControl<any[]>, ControlValueAccessor, OnInit, OnDestroy {

  static nextId = 0;
  public validatorChange = () => {};

  public defaultValue: any[];
  public originalDataSet: any[];
  private init: boolean = false;

  constructor(
  ) {

  }

  set isDisabled(isDisabled: boolean){
    this.disabled = isDisabled;
  }

  get isDisabled(): boolean{
    return this.disabled;
  }

  public get value(): any[]{
    console.log(this._value);
    return this._value;
  }

  public set value(obj: any[]){
    this._value = obj;
    this.stateChanges.next();
    this._onChange(this._value);
  }

  get placeholder(): string{
    return this._placeholder;
  }

  @Input()
  set placeholder(obj: string){
    this._placeholder = obj;
    this.stateChanges.next();
  }


  _min = 0;

  get min(): number{
    return this._min;
  }

  @Input()
  set min(n: number){
    this._min = n;
    if(n > 0) this.required = true;
  }

  @Input()
  max = 0;


  _sourceData: any[];

  @Input()
  set sourceData(data: any[]){
    this._sourceData = data;
    this.originalDataSet = Object.assign([], data);

    for (let o of this._value){
      for(let i=0; i < this._sourceData.length; i++){
        if(this.getId(this._sourceData[i]) === this.getId(o)) {
          this.removeElementFromSource(i);
          break;
        }
      }
    }
  }

  get sourceData(): any[]{
    return this._sourceData;
  }

  @Input()
  public disabled: boolean;

  @Input()
  required: boolean;

  _value: any[] = [];

  @HostBinding() id = `app-dual-listbox-id-${DualListboxComponent.nextId++}`;


  _placeholder: string;

  stateChanges = new Subject<void>();


  ngControl: NgControl;
  focused = false;
  empty: boolean;
  shouldLabelFloat = true;

  errorState = false;
  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;

  form = new FormGroup({
    sourceSearch: new FormControl(),
    selectedSearch: new FormControl(),
    source: new FormControl(),
    selected: new FormControl()
  });

  get sourceSearchField(): FormControl{
    return this.form.controls.sourceSearch as FormControl;
  }

  get selectedSearchField(): FormControl{
    return this.form.controls.selectedSearch as FormControl;
  }

  get sourceField(): FormControl{
    return this.form.controls.source as FormControl;
  }

  get selectedField(): FormControl{
    return this.form.controls.selected as FormControl;
  }


  @Input()
  getId = (obj: any) => obj.id

  @Input()
  getToString = (obj: any) => obj.name


  onContainerClick(event: MouseEvent): void {
  }

  setDescribedByIds(ids: string[]): void {
  }


  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.stateChanges.complete();
  }

  addToSelectedList(id: any): void{
    let index;
    let obj;
    for (let i = 0; i < this._sourceData.length; i++ ){
      if (this.getId(this._sourceData[i]) === id){
        index = i;
        obj = this._sourceData[i];
        break;
      }
    }
    this.removeElementFromSource(index);
    this._value.unshift(obj);
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  addManyToSelectedList(): void{
    if (this.sourceField.value === null) { return; }
    const ids = this.sourceField.value.reverse();
    for (const id of ids){
      this.addToSelectedList(id);
    }
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  addToSourceList(id: any): void{
    let index;
    let obj;
    for (let i = 0; i < this._value.length; i++ ){
      if (this.getId(this._value[i]) === id){
        index = i;
        obj = this._value[i];
        break;
      }
    }
    this.removeElementFromSelected(index);
    this._sourceData.unshift(obj);
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  addManyToSourceList(): void{
    if (this.selectedField.value === null) { return; }
    const ids = this.selectedField.value.reverse();
    for (const id of ids){
      this.addToSourceList(id);
    }
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  addAllToSelected(): void{
    this._sourceData.reverse();
    for (let i = 0; i < this._sourceData.length; i++ ){
      this._value.unshift(this._sourceData[i]);
    }
    this._sourceData = [];
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  addAllToSource(): void{
    this._value.reverse();
    for (let i = 0; i < this._value.length; i++ ){
      this._sourceData.unshift(this._value[i]);
    }
    this._value = [];
    this._onChange(this._value);
    this.validatorChange();
    this.sourceField.setValue([]);
    this.selectedField.setValue([]);
  }

  private removeElementFromSource(index: number): void{
    this._sourceData.splice(index, 1);
  }

  private removeElementFromSelected(index: number): void{
    this._value.splice(index, 1);
  }

  matchFromSource(obj: any): boolean{
    let searchText = this.sourceSearchField.value;
    if (searchText === null) { return true; }
    searchText = searchText.trim().toLowerCase();
    if (searchText === ''){ return true; }
    const obText = this.getToString(obj).trim().toLowerCase();
    return obText.indexOf(searchText) !== -1;
  }

  matchFromSelected(obj: any): boolean{
    let searchText = this.selectedSearchField.value;
    if (searchText === null) { return true; }
    searchText = searchText.trim().toLowerCase();
    if (searchText === ''){ return true; }
    const obText = this.getToString(obj).trim().toLowerCase();
    return obText.indexOf(searchText) !== -1;
  }



  setFocus(f: boolean) {
    this.focused = f;
    this.stateChanges.next();
    if (f) this._onTouch();
    else this.control.updateValueAndValidity();
  }

  public _onChange: (_: any) => void;
  public _onTouch: () => void;

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if(this.init){
      this._sourceData = Object.assign([], this.originalDataSet);
      if(obj===null){
        this._value = Object.assign([], this.defaultValue);
      }else{
        this._value = obj;
      }
    }else{
      if (obj === null) obj = [];
      if(!this.init) {
        this.defaultValue = Object.assign([], obj);
        this.init = true;
      }
      this._value = obj;
    }

    for (let o of this._value){
      for(let i=0; i < this._sourceData.length; i++){
        if(this.getId(this._sourceData[i]) === this.getId(o)) {
          this.removeElementFromSource(i);
          break;
        }
      }
    }

    if(this._onChange) this._onChange(this._value);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.validatorChange = fn;
  }

  control: AbstractControl = null;

  validate(control: AbstractControl): ValidationErrors | null {

    this.control = control;

    let valid = true;
    let errors = {};

    if (this.max > 0 && this.max < this._value.length){
      valid = false;
      errors = {...errors, max: true};
    }

    if (this.min > 0 && this.min > this._value.length){
      valid = false;
      errors = {...errors, min: true};
    }
    if (!valid && control.touched) {
      this.errorState = true;
      return errors;
    }

    this.errorState = false;
    return null;
  }

}
