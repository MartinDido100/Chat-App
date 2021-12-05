import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, Usuario } from '../interfaces/auth.interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { of, Observable } from 'rxjs';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl
  private usuario!: Usuario

  constructor(private http: HttpClient,private cS: CookieService,private socialAuthService: SocialAuthService) { }

  get user():Usuario{
    return {...this.usuario}
  }

  login(username: string,password: string){

    const url: string = `${this.baseUrl}/auth/login`;
    const body = {username,password}

    return this.http.post<AuthResponse>(url,body).pipe(
      tap(resp =>{
        if(resp.ok){
          this.cS.set('token',resp.token!)
        }
      }),
      map(resp => {
        return resp.ok
      })
    )

  }
  
  googleLogout(){
    this.socialAuthService.signOut();
  }

  async googleLogin(){
    const url = `${this.baseUrl}/auth/google`;
    const signIn: SocialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    const { email, name, id } = signIn;
    const body = {
      username: name,
      email,
      password: id
    };
    return this.http.post<AuthResponse>(url,body).pipe(
      tap(resp => this.cS.set('token',resp.token!)),
      map(resp => resp.ok)
    )
  }

  register(username: string,email:string,password: string){

    const url: string = `${this.baseUrl}/auth/register`;
    const body = {username,email,password}

    return this.http.post<AuthResponse>(url,body).pipe(
      tap(resp =>{
        if(resp.ok){
          this.cS.set('token',resp.token!)
        }
      }),
      map(resp => {
        return resp.ok
      })
    )

  }

  cargarUsuario(resp: AuthResponse){
    this.usuario = {
      username: resp.username!,
      email: resp.email,
      userId: resp.userId!
    }
  }

  verifyToken(){
    const url = `${this.baseUrl}/auth/verify`
    return this.http.get<AuthResponse>(url).pipe(
      map(resp => {
        this.cargarUsuario(resp);
        return resp.ok
      }),
      catchError(()=> of(false))
    )
  }

}
