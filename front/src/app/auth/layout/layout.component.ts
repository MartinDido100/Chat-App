import { Component, OnChanges, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { GoogleLoadingService } from '../services/google-loading.service';

interface messages {
  title: string;
  linesMsg: string;
  qsMsg: string;
  qsLink: string;
  qsRoute: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  messagesByUrl!: messages;

  constructor(
    private router: Router,
    private cS: CookieService,
    private aS: AuthService,
    private gL: GoogleLoadingService,
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.putMessages(event.url);
      }
    });
  }

  ngOnInit(): void {
    this.gL.googleLoading = false;
    this.cS.delete('token');
    this.cS.deleteAll('/');
  }

  async googleLogin() {
    (await this.aS.googleLogin()).subscribe(
      (ok) => {
        this.gL.googleLoading = true;
        if (ok) {
          this.router.navigateByUrl('/homepage');
        }
      },
      (err) => console.log
    );
  }

  putMessages(url: string) {
    if (url.substring(6) === 'register') {
      this.messagesByUrl = {
        title: 'Register an account',
        linesMsg: 'or continue via email',
        qsMsg: 'You have an account?',
        qsLink: 'Login here',
        qsRoute: '/login',
      };
    } else {
      this.messagesByUrl = {
        title: 'Log in to the chat',
        linesMsg: 'or use your account',
        qsMsg: "Don't have account?",
        qsLink: 'Register here',
        qsRoute: 'register',
      };
    }
  }
}
