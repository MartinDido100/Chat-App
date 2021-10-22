import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  validateField(field: string, form: FormGroup,error: string):boolean | undefined{
    return form.get(field)?.hasError(error) && form.get(field)?.touched;
  }

  comparePaswords(pass1: string, pass2: string){
    return (formGroup: AbstractControl) => {
      const password1 = formGroup.get(pass1);
      const password2 = formGroup.get(pass2);

      if(password2?.errors && password2.errors.noIguales){
        return;
      }

      if(password2?.value !== password1?.value){
        password2?.setErrors({
          noIguales: true
        })
        return {
          noIguales: true
        }
      }

      password2?.setErrors(null);
      return null;
    }
  }

}
