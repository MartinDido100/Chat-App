import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleLoadingService {

  public googleLoading : boolean = false;

  constructor() { }
}
