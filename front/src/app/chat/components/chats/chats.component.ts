import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/auth/interfaces/auth.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  chatActivo: string = '';
  clickedFriend: Usuario = {
    username: '',
    userId: '',
  };
  nuevosMsg: number = 0;
  friendsA: Usuario[] = [];
  lastMsgA: string[] = [];

  getCssClass(username: string) {
    return this.chatActivo === username ? 'chat active-chat' : 'chat';  
  }

  chargeClickedFried(friend: Usuario){
    this.clickedFriend = friend;
    this.chatActivo = friend.username;
  }

  get user(){
    return this.aS.user;
  }

  get userFriends(){
    return this.chS.friends;
  }

  get lastMsg(){
    return this.chS.lastMsgs;
  }

  constructor(private aS: AuthService,private chS:ChatService) {}

  ngOnInit(): void {}

}
