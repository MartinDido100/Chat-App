import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ChatsComponent } from './components/chats/chats.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatSimpleComponent } from './components/chat-simple/chat-simple.component';


@NgModule({
  declarations: [
    LayoutComponent,
    ChatsComponent,
    PerfilComponent,
    ChatSimpleComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
