import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleLoadingService } from '../../services/google-loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerError: string = '';
  submited: boolean = false;
  cargando: boolean = false;
  registerText: string = 'Register';

  registerForm: FormGroup = this.fB.group(
    {
      username: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern(this.vS.emailPattern)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmP: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: [this.vS.comparePaswords('password', 'confirmP')],
    }
  );

  constructor(
    private fB: FormBuilder,
    private vS: ValidationsService,
    private aS: AuthService,
    private router: Router,
    private gL: GoogleLoadingService
  ) {}

  ngOnInit(): void {}

  get googleLoading(): boolean{
    return this.gL.googleLoading;
  }

  validateField(field: string, error: string) {
    return this.vS.validateField(field, this.registerForm, error);
  }

  register() {
    this.submited = true;
    if (this.registerForm.invalid) {
      this.cargando = false;
      this.registerForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const { username, email, password } = this.registerForm.value;

    this.aS.register(username, email, password).subscribe(
      (valido: boolean) => {
        if (valido) {
          this.router.navigateByUrl('/homepage');
        }
      },
      (error: HttpErrorResponse) => {
        this.registerError = error.error.msg;
        this.cargando = false;
      }
    );
  }
}
