import { HttpErrorResponse } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidationsService } from '../../services/validations.service';
import { GoogleLoadingService } from '../../services/google-loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  viewPass: boolean = false;
  loginError: string = '';
  submited: boolean = false;
  cargando: boolean = false;

  loginForm: FormGroup = this.fB.group({
    username: ['', [Validators.required, Validators.min(3)]],
    password: ['', [Validators.required, Validators.min(6)]],
  });

  constructor(
    private fB: FormBuilder,
    private router: Router,
    private aS: AuthService,
    private vS: ValidationsService,
    private gL : GoogleLoadingService
  ) {}

  get googleLoading(): boolean {
    return this.gL.googleLoading;
  } 

  ngOnInit(): void {}

  checkPassView(){
    return this.viewPass ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  checkInputType(){
    return this.viewPass ? 'text' : 'password';
  }

  validateField(field: string, error: string) {
    return this.vS.validateField(field, this.loginForm, error);
  }

  login() {
    this.submited = true;
    if (this.loginForm.invalid) {
      this.cargando = false;
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const { username, password } = this.loginForm.value;

    this.aS.login(username, password).subscribe(
      (valido: boolean) => {
        if (valido) {
          this.router.navigateByUrl('/homepage');
        }
      },
      (error: HttpErrorResponse) => {
        this.loginError = error.error.msg;
        this.cargando = false;
      }
    );
  }
}
