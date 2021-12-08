import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Usuario } from '../../../auth/interfaces/auth.interfaces';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatMessage } from '../../interfaces/chat.interfaces';


@Component({
  selector: 'app-chat-simple',
  templateUrl: './chat-simple.component.html',
  styleUrls: ['./chat-simple.component.scss']
})
export class ChatSimpleComponent implements OnInit,OnChanges {

  messageInput: string = '';
  conversation: ChatMessage[] = [];
  loading: boolean = false;
  @Input() friend!: Usuario;

  get user(): Usuario{
    return this.aS.user;
  }

  constructor(private cS: ChatService, private aS: AuthService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getConver();
  }

  getMsgType(enviadoPor: string){
    return enviadoPor === this.user.userId ? 'msg_li msg_sent' : 'msg_li msg_recieved';
  }

  getConver(){
    this.loading = true;
    this.cS.getConver(this.user.userId, this.friend.userId).subscribe(conver => {
      this.conversation = conver;
      this.loading = false;
    });
  }

  sendMsg(){
    if(this.messageInput.length === 0) return;
    this.cS.addMsg(this.user.userId, this.friend.userId, this.messageInput).subscribe(res=> {
      this.conversation.push(res);
    })
    this.messageInput = '';
  }

  ngOnInit(): void {}

}
