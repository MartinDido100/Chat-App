import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'auth',
    loadChildren: ()=>import('./auth/auth.module').then(m => m.AuthModule),
    data:{
      title: 'Login'
    }
  },
  {
    path:'homepage',
    loadChildren: ()=>import('./chat/chat.module').then(m => m.ChatModule),
    data:{
      title: 'Homepage'
    }
  },
  {
    path:'**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
