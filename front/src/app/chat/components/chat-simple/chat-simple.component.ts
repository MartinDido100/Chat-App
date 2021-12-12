import { Component, Input, OnInit, OnChanges, ViewChild, ElementRef, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Usuario } from '../../../auth/interfaces/auth.interfaces';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ChatMessage } from '../../interfaces/chat.interfaces';
import { Socket } from 'ngx-socket-io';

interface MessageFromSocket{
  message: ChatMessage;
  sentFrom: string;
}

@Component({
  selector: 'app-chat-simple',
  templateUrl: './chat-simple.component.html',
  styleUrls: ['./chat-simple.component.scss']
})
export class ChatSimpleComponent implements OnInit,OnChanges,AfterViewChecked {

  messageInput: string = '';
  conversation: ChatMessage[] = [];
  loading: boolean = false;
  @Input() friend!: Usuario;
  @ViewChild('chatBox') chatBox!: ElementRef;

  get user(): Usuario{
    return this.aS.user;
  }

  constructor(private cS: ChatService, private aS: AuthService,private socket : Socket) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.conversation = [];
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
      this.socket.emit('sendMessage',{message: res,friendId: this.friend.userId,sentFrom: this.user.userId});
    })
    this.messageInput = '';
  }

  scrollToBottom(){
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (error) {}
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.socket.on('messageReceived',(data: MessageFromSocket) => {
      if(data.sentFrom === this.friend.userId){
        this.conversation.push(data.message);
      }
      this.cS.updateLastMsg(data.sentFrom,data.message);
    });

    this.socket.on('messageReceivedOffline',()=>{
      this.cS.updateNewMsgOffline(this.user.userId,this.friend.userId).subscribe();
    })
  }

}
