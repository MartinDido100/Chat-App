import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  get user(){
    return this.aS.user;
  }

  constructor(private router: Router, 
              private cS: CookieService,
              private gS: SocialAuthService,
              private aS: AuthService,
              private chS: ChatService) {}

  ngOnInit(): void {
    this.chS.getLastsMsgs(this.user.userId)
  }

  getCssClass(campo: string) {
    return this.router.url.includes(campo) ? 'active' : '';
  }

  logout() {
    this.gS.signOut(false);
    this.cS.delete('token');
    this.cS.deleteAll('/');
    this.router.navigateByUrl('/auth/login');
  }
}
