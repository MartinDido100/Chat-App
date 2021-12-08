import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap, filter } from 'rxjs/operators';
import { ChatResponse, UserSearchResponse, UserSearched, AddMsgResponse } from '../interfaces/chat.interfaces';
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

  constructor(private http: HttpClient) { }

  get lastMsgs(){
    return [...this.lastMsgsArray];
  }

  get friends(){
    return [...this.friendsArray];
  }

  getLastsMsgs(userId: string){
    const url = `${this.baseUrl}/user/getFriends/${userId}`
    return this.http.get<AuthResponse>(url).pipe(
      switchMap((resp) => {
        if(resp.ok){
          this.friendsArray = resp.friends!;
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

  deleteFriend(userId: string, friend: UserSearched){
    const url = `${this.baseUrl}/user/deleteFriend`;
    const deleteChatUrl = `${this.baseUrl}/chat/borrarChat`;

    const chatBody = {
      body: {
        miembro1: userId,
        miembro2: friend._id
      }
    }

    const body = {
      userId,
      friendUsername: friend.username
    }

    this.http.delete(deleteChatUrl, chatBody).subscribe();

    this.lastMsgsArray = this.lastMsgsArray.filter(msg => msg.friend !== friend._id);

    return this.http.put<AuthResponse>(url, body).pipe(
      tap(resp => {
        if(resp.ok){
          this.friendsArray = resp.friends!;
        }
      })
    );
  }

  addFriend(userId: string, friend: UserSearched){
    const url = `${this.baseUrl}/user/addFriend`;
    const newCharUrl = `${this.baseUrl}/chat/newChat`;
    const { _id, username } = friend;

    const body = {
      userId,
      friendUsername: username
    }

    const newChatBody = {
      miembro1: userId,
      miembro2: _id
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
          enviadoPor: resp.createdMsg.enviadoPor,
          recibidoPor: resp.createdMsg.recibidoPor,
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
