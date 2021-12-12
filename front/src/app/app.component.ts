import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  constructor(private router: Router, private titleService: Title,private socket : Socket){}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.titleService.setTitle(this.getNestedRouteTitles().join(' | '));
    });
  }

  getNestedRouteTitles(): string[] {
    let currentRoute = this.router.routerState.root.firstChild;
    const titles: string[] = [];

    while (currentRoute) {
      if (currentRoute?.snapshot?.routeConfig?.data?.title) {
        titles.push(currentRoute.snapshot.routeConfig.data.title);
      }

      currentRoute = currentRoute.firstChild;
    }

    return titles;
  }

  getLastRouteTitle(): string {
    let currentRoute = this.router.routerState.root.firstChild;

    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute?.snapshot.data?.title;
  }


}
