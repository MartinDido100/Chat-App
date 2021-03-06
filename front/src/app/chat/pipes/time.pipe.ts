import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string): string {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const date = new Date(value);
    return date.toLocaleString(locale, { hour: 'numeric', minute: 'numeric',second: 'numeric', hour12: false });
  }

}
