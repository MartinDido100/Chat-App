import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  transform(value: string): string {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const date = new Date(value);
    return date.toLocaleString(locale,{day: 'numeric', month: 'numeric', year: 'numeric'});
  }

}
