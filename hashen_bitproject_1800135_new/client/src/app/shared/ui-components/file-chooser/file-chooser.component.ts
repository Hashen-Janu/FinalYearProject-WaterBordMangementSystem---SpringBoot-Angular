// tslint:disable
import {Component, forwardRef, Input, OnInit, HostBinding, OnDestroy} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, NgControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../../api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';


export class FileDetail {
  id: string;
  filemimetype: string;
  filesize: number;
  originalname: string;
}


@Component({
  selector: 'app-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileChooserComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileChooserComponent),
      multi: true,
    }, {
      provide: MatFormFieldControl,
      useExisting: FileChooserComponent,
    }
  ]
})
export class FileChooserComponent implements MatFormFieldControl<string[]>, ControlValueAccessor, OnInit, OnDestroy {

  private init = false;
  private defaultValues: string[] = [];
  public fileDetails: FileDetail[] = [];
  private _disabled: boolean = false;
  public change: (value: any) => void;
  public touched: () => void;
  public validatorChange = () => {
  };


  _min: number = 0;
  _max: number = 0;
  _maxFileSize: number = 12 * 1024 * 1024;
  _accept: string[] = [];
  public errorState: boolean;

  @Input()
  set min(min: number) {
    this._min = min;
    this.required = min > 0;
    this.validatorChange();
  }

  get min(): number {
    return this._min;
  }

  @Input()
  set max(max: number) {
    this._max = max;
    this.validatorChange();
  }

  get max(): number {
    return this._max;
  }

  @Input()
  set maxFileSize(fileSize: number) {
    if (fileSize > 12 * 1024 * 1024) {
      console.error('Maximum file upload size is 12MB (12 * 1024 * 1024 B)');
      return;
    }
    this._maxFileSize = fileSize;
    this.validatorChange();
  }

  get maxFileSize(): number {
    return this._maxFileSize;
  }

  @Input()
  set accept(accept: string[]) {
    this._accept = accept;
    this.validatorChange();
  }

  get accept(): string[] {
    return this._accept;
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set isDisabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get isDisabled(): boolean {
    return this._disabled;
    this.init = false;
  }

  public constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  static nextId = 0;
  @HostBinding() id = `app-file-chooser-id-${FileChooserComponent.nextId++}`;

  @Input()
  placeholder: string = "No chooses files to show";
  shouldLabelFloat = true;
  required: boolean;
  focused: boolean;

  stateChanges = new Subject<void>();
  ngControl: NgControl;

  get empty(): boolean{
    return this.value.length === 0;
  }

  set empty(e: boolean){
    if(e){
      this.removeAll();
    }
  }

  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  setDescribedByIds(ids: string[]): void {

  }
  onContainerClick(event: MouseEvent): void {
    this.setFocus(true);
  }

  control: AbstractControl = null;

  setFocus(v: boolean){
    this.focused = v;
    if(v) this.touched();
    else this.control.updateValueAndValidity();
  }

  get value(): string[]{
    const v: string[] = [];
    for(const fileDetail of this.fileDetails){
      v.push(fileDetail.id);
    }
    return v;
  }

  set value(values: string[]){
    this.fileDetails = [];
    values.forEach((value) => {
      const index = this.fileDetails.length;
      this.fileDetails[index] = new FileDetail();
      this.fileDetails[index].id = value;
      this.http.get<FileDetail>(ApiManager.getURL(`files/details/${value}`)).subscribe((fileDetail) => {
        this.fileDetails[index] = fileDetail;
      });
    });
  }

  ngOnInit(): void {

  }

  get thumbnailUrl(): string{
    return ApiManager.getURL('files/thumbnail/');
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

  writeValue(data: any): void {
    if(this.init){
      if(data === null){
        this.value = Object.assign([], this.defaultValues);
      }else{
        this.value = data;
      }
    }else{
      this.init = true;
      if(data === null) data = [];
      this.defaultValues = Object.assign([], data);
      this.value = data;
    }
    if(this.change) this.change(this.value);
    this.stateChanges.next();
  }

  isValidFile(file: File): boolean {
    if (this.accept.length === 0) return true;
    let valid = false;
    for (let type of this.accept) {
      type = type.trim().toLowerCase();
      if (type === '*/*') { valid = true; break;}

      if (type.startsWith('.')) {
        const dotPos = file.name.lastIndexOf('.');
        if (dotPos > 0) {
          const extension = file.name.substring(dotPos).toLowerCase();
          if (type === extension) { valid = true; break; }
        }
      } else {
        const fileTypeParts = file.type.toLowerCase().split("/");
        const typeParts = type.split("/");
        if (fileTypeParts[0] !== typeParts[0]) continue;
        if (typeParts[1] === '*' || typeParts[1] === fileTypeParts[1]) { valid = true; break; }
      }
    }
    return valid;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.validatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control;
    let valid = true;
    let errors = {};

    if (this.max > 0 && this.max < this.value.length){
      valid = false;
      errors = {...errors, max: true};
    }

    if (this.min > 0 && this.min > this.value.length){
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

  formatBytes(bytes: number): string{
    if(bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '\u00A0' + sizes[i];
  }

  upload(files: FileList): void{
    for(let i=0; i<files.length; i++){
      const file = files[i];

      if(!this.isValidFile(file)){
        this.snackBar.open(file.name + ' is not a valid file', null, {duration: 3000})
        continue;
      }

      if(file.size > this.maxFileSize){
        this.snackBar.open(file.name + ' exceed the maximum allowed file size ('+ this.formatBytes(this.maxFileSize) +').', null, {duration: 3000})
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      const fileDetail = new FileDetail();
      fileDetail.id = null;
      fileDetail.filemimetype = file.type;
      fileDetail.originalname = file.name;
      fileDetail.filesize = file.size;

      this.fileDetails.push(fileDetail);

      this.http.post<any>(ApiManager.getURL('files'), formData).subscribe(
        (response) => {
                fileDetail.id = response.id;
                this.change(this.value);
                this.validatorChange();
                this.stateChanges.next();
             },
        (e) => {
                console.log(e);
                this.snackBar.open(fileDetail.originalname + ' uploading failed', null, {duration: 2000})
                  .afterDismissed().subscribe(() => {
                   this.fileDetails.splice(this.fileDetails.indexOf(fileDetail), 1);
                   this.change(this.value);
                   this.validatorChange();
                   this.stateChanges.next();
                });
             }
      );
    }
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity();
  }

  remove(id: string) {
    let pos = -1;
    for(let i=0; i<this.fileDetails.length; i++){
      if(id === this.fileDetails[i].id){
        pos = i;
        break;
      }
    }

    if(pos !== -1){
      this.fileDetails.splice(pos, 1);
    }

    this.change(this.value);
    this.validatorChange();
    this.stateChanges.next();
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity();
  }

  removeAll() {
    this.fileDetails = [];
    this.change(this.value);
    this.validatorChange();
    this.stateChanges.next();
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity();
  }

  openFilesDialog() {
    const chooser = document.createElement('input');
    chooser.type = 'file';
    chooser.multiple = true;
    if(this.accept.length > 0) chooser.accept = this.accept.join(",");
    chooser.onchange = () => {
      this.upload(chooser.files);
    }
    chooser.click();
    this.control.markAsTouched();
  }
}


