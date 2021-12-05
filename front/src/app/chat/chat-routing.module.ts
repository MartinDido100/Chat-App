import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ChatsComponent } from './components/chats/chats.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {path:'chats', component: ChatsComponent},
      {path: 'profile', component: PerfilComponent},
      {path: 'search', component: SearchComponent},
      {path:'**',redirectTo: 'chats'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
