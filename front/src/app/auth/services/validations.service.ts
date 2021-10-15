import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

  validateField(field: string, form: FormGroup,error: string):boolean | undefined{
    return form.get(field)?.hasError(error) && form.get(field)?.touched;
  }

}
