import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/auth/interfaces/auth.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { Socket } from 'ngx-socket-io';
import { ChatMessage, NuevosMsg } from '../../interfaces/chat.interfaces';

interface TeAgregaron{
  friend: Usuario;
}

interface MessageFromSocket{
  message: ChatMessage;
  sentFrom: string;
}

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
  friendsA: Usuario[] = [];

  getCssClass(username: string) {
    return this.chatActivo === username ? 'chat active-chat' : 'chat';  
  }

  chargeClickedFriend(friend: Usuario){
    this.clickedFriend = friend;
    this.chatActivo = friend.username;
    const index = friend.newMsgA!.findIndex(f => f.friend === this.user.userId);
    if(friend.newMsgA![index].numberOfMsgs > 0){
      this.chS.resetNewMsgOffline(friend.userId,this.user.userId).subscribe();
    }

    const index2 = this.nuevosMsg.findIndex(f => f.friend === friend.userId);
    if(this.nuevosMsg[index2].nuevosMsg > 0){
      this.chS.resetNuevosMsg(friend.userId);
    }
  }

  get user(){
    return this.aS.user;
  }

  get userFriends(){
    return this.chS.friends;
  }

  get nuevosMsg(): NuevosMsg[]{
    return this.chS.nuevosMsgCount;
  }

  get lastMsg(){
    return this.chS.lastMsgs;
  }

  constructor(private aS: AuthService,private chS:ChatService,private socket: Socket) {}

  ngOnInit(): void {
    this.socket.on('teAgregaron',(data: TeAgregaron) => {
      this.chS.updateFriends(data.friend);
    })
    this.socket.on('messageReceived',(data: MessageFromSocket)=> {
      if(data.sentFrom !== this.clickedFriend.userId){
        this.chS.updateLastMsg(data.sentFrom,data.message);
        this.chS.updateNuevosMsg(data.sentFrom);
      }
    })
  }

}
