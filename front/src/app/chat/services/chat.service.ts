import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { ChatResponse, UserSearchResponse, AddMsgResponse, ChatMessage, NuevosMsg } from '../interfaces/chat.interfaces';
import { Usuario } from 'src/app/auth/interfaces/auth.interfaces';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';

interface LastMessage{
  message: string;
  friend: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  actualConverId: string = '';
  baseUrl: string = environment.baseUrl;
  private lastMsgsArray: LastMessage[] = [];
  private friendsArray: Usuario[] = [];
  private nuevosMsg: NuevosMsg[] = [];

  constructor(private http: HttpClient) { }

  get lastMsgs(){
    return [...this.lastMsgsArray];
  }

  get friends(){
    return [...this.friendsArray];
  }

  get nuevosMsgCount(){
    return [...this.nuevosMsg];
  }

  logout(){
    this.friendsArray = [];
    this.lastMsgsArray = [];
    this.nuevosMsg = [];
  }

  updateNuevosMsg(friendId: string){
    const index = this.nuevosMsg.findIndex(msg => msg.friend === friendId);
    if(index != -1){
      this.nuevosMsg[index].nuevosMsg++;
    }
  }

  resetNuevosMsg(friendId: string){
    const index = this.nuevosMsg.findIndex(msg => msg.friend === friendId);
    if(index != -1){
      this.nuevosMsg[index].nuevosMsg = 0;
    }
  }

  cargarNewMsg(friend: Usuario,userId: string){
    const index = friend.newMsgA!.findIndex(fr => fr.friend === userId);
    if(index != -1){
      this.nuevosMsg.push({
        friend: friend.userId,
        nuevosMsg: friend.newMsgA![index].numberOfMsgs
      });
    }
  }

  updateNewMsgOffline(userId: string, friendId: string){
    const url = `${this.baseUrl}/user/updateNewMsgA`;
    const body = {
      userId,
      friendId
    }
    return this.http.put<AuthResponse>(url, body);
  }

  resetNewMsgOffline(userId: string, friendId: string){
    const url = `${this.baseUrl}/user/resetNewMsgA`;
    const body = {
      userId,
      friendId
    }
    return this.http.put<AuthResponse>(url, body);
  }

  getLastsMsgs(userId: string){
    this.lastMsgsArray = [];
    this.nuevosMsg = [];
    const url = `${this.baseUrl}/user/getFriends/${userId}`
    return this.http.get<AuthResponse>(url).pipe(
      switchMap((resp) => {
        if(resp.ok){
          this.friendsArray = resp.friends!;
          resp.friends!.forEach(friend => {
            this.cargarNewMsg(friend,userId);
          })
        }
        const {friends} = resp;
        const requests = friends!.map(friend => {
          const url = `${this.baseUrl}/chat/get/chat/${userId}/${friend.userId}`;
          return this.http.get<ChatResponse>(url).pipe(
            map(res => {
              return res.mensajes;
            })
          );
        });
        return requests;
      })
    ).subscribe(msgs$ => {
      msgs$.forEach(msgs => {
        if(msgs.length > 0){
          this.lastMsgsArray.push({
            message: msgs[msgs.length - 1].contenido,
            friend: msgs[msgs.length - 1].recibidoPor === userId ? msgs[msgs.length - 1].enviadoPor : msgs[msgs.length - 1].recibidoPor
          });
        }
      })
    })
  }

  getConver(userId: string, friendId: string){
    const url = `${this.baseUrl}/chat/get/chat/${userId}/${friendId}`;
    return this.http.get<ChatResponse>(url).pipe(
      tap(resp => {
        this.actualConverId = resp.chatId!;
      }),
      map(res => {
        return res.mensajes;
      })
    )
  }

  searchUser(query: string){
    const url = `${this.baseUrl}/user/get/users/${query.trim()}`;

    return this.http.get<UserSearchResponse>(url).pipe(
      map(resp => {
        if(resp.ok){
          return resp.usuarios;
        }
        return [];
      })
    );
  }

  updateFriends(friend: Usuario){
    this.friendsArray.push(friend);
    this.nuevosMsg.push({
      friend: friend.userId,
      nuevosMsg: 0
    })
  }

  deleteFriend(userId: string, friend: Usuario){
    const url = `${this.baseUrl}/user/deleteFriend`;
    const deleteChatUrl = `${this.baseUrl}/chat/borrarChat`;

    const chatBody = {
      body: {
        miembro1: userId,
        miembro2: friend.userId
      }
    }

    const body = {
      userId,
      friendUsername: friend.username
    }

    this.http.delete(deleteChatUrl, chatBody).subscribe();

    this.lastMsgsArray = this.lastMsgsArray.filter(msg => msg.friend !== friend.userId);

    return this.http.put<AuthResponse>(url, body).pipe(
      tap(resp => {
        if(resp.ok){
          this.friendsArray = resp.friends!;
        }
      })
    );
  }

  addFriend(userId: string, friend: Usuario){
    const url = `${this.baseUrl}/user/addFriend`;
    const newCharUrl = `${this.baseUrl}/chat/newChat`;

    const body = {
      userId,
      friendUsername: friend.username
    }

    const newChatBody = {
      miembro1: userId,
      miembro2: friend.userId
    }

    this.http.post(newCharUrl, newChatBody).subscribe();  
  
    return this.http.put<AuthResponse>(url, body).pipe(
      tap(resp => {
        if(resp.ok){
          this.friendsArray = resp.friends!;
        }
      })
    );
  }

  updateLastMsg(friendId: string, msg: ChatMessage){
    const index = this.lastMsgsArray.findIndex(msg => msg.friend === friendId);
    const newLMBody = {
      message: msg.contenido,
      friend: friendId
    }
    if(index != -1){
      this.lastMsgsArray[index] = newLMBody;
    }else{
      this.lastMsgsArray.push(newLMBody);
    }
  };

  addMsg(userId: string, friendId: string, msg: string){
    const url = `${this.baseUrl}/msg/create`;

    const body = {
      enviadoPor: userId,
      recibidoPor: friendId,
      contenido: msg,
      conversacion: this.actualConverId
    }

    return this.http.post<AddMsgResponse>(url, body).pipe(
      tap(resp => {
        const index = this.lastMsgsArray.findIndex(msg => msg.friend === friendId);
        const newLMBody = {
          message: resp.createdMsg.contenido,
          friend: resp.createdMsg.recibidoPor === userId ? resp.createdMsg.enviadoPor : resp.createdMsg.recibidoPor
        }
        if(index != -1){
          this.lastMsgsArray[index] = newLMBody;
        }else{
          this.lastMsgsArray.push(newLMBody);
        }
      }),
      map(resp => {
        return resp.createdMsg;
      })
    );
  }

}
