import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ChatsComponent } from './components/chats/chats.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatSimpleComponent } from './components/chat-simple/chat-simple.component';
import { SearchComponent } from './components/search/search.component';
import { TimePipe } from './pipes/time.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutComponent,
    ChatsComponent,
    PerfilComponent,
    ChatSimpleComponent,
    SearchComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChatModule { }
