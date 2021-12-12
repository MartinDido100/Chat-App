import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/services/auth.service';
import { ChatService } from '../services/chat.service';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../../auth/interfaces/auth.interfaces';

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
              private chS: ChatService,
              private socket: Socket) {}

  ngOnInit(): void {
    this.chS.getLastsMsgs(this.user.userId);
    this.socket.emit('login',{username: this.user.username, userId: this.user.userId});
  }

  getCssClass(campo: string) {
    return this.router.url.includes(campo) ? 'active' : '';
  }

  logout() {
    this.socket.emit('logout',{userToLogout: this.user});
    this.gS.authState.subscribe(user => {
      if (user) {
        this.gS.signOut(false);
      }
    })
    this.chS.logout();
    this.cS.delete('token');
    this.cS.deleteAll('/');
    this.router.navigateByUrl('/auth/login');
  }
}
