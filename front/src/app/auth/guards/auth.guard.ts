import { Injectable } from '@angular/core';
import { CanActivate,CanLoad,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanLoad {

  constructor(private aS: AuthService,private router: Router){}

  canActivate(): boolean | Observable<boolean> {
    return this.aS.verifyToken().pipe(
      tap(ok => {
        if(!ok){
          this.router.navigateByUrl('/auth');
        }
      })
    )
  }

  canLoad(): boolean | Observable<boolean>{
    
    return this.aS.verifyToken().pipe(
      tap(ok => {
        if(!ok){
          this.router.navigateByUrl('/auth');
        }
      })
    )

  }
  
  
}
