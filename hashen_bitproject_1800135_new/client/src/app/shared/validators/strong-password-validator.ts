import {AbstractControl, ValidatorFn} from '@angular/forms';

export function strongPassword(minLength: number, maxLength: number, minScore: number = 8): ValidatorFn{
  return (control: AbstractControl) => {

    const password = control.value;

    if (password === null || password === '' || password.length < minLength || password.length > maxLength){
      return null;
    }

    let score = 0;
    if (password.length >= 6){ score += 1; }
    if (password.length >= 8){ score += 2; }
    if (/[a-z]/.test(password)) { score += 1; }
    if (/[A-Z]/.test(password)) { score += 1; }
    if (/[0-9]/.test(password)) { score += 1; }
    if (/[@#$%!~`\^\&*\(\)_+\-=\[\]\{\}\|\\,\.\/\?]/.test(password)) { score += 2; }

    return score < minScore ? { strongPassword: true } : null;
  };
}
