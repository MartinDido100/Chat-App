import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../auth/interfaces/auth.interfaces';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  busqueda: string = '';
  suggestions: Usuario[] = [];
  noResults: boolean = false;
  constructor(private cS: ChatService,
              private aS: AuthService,
              private socket: Socket) { }


  get user(): Usuario{
    return this.aS.user;
  }

  get friends(): Usuario[]{
    return this.cS.friends;
  }

  isNotFriend(username: string){
    return this.friends.findIndex(friend => friend.username === username) === -1;
  }

  getLiClass(suggestion: Usuario){
      return suggestion.username === this.user.username ? 'disabled' : 'suggestions_li';
  }

  addFriend(suggestion: Usuario){
    this.cS.addFriend(this.user.userId, suggestion).subscribe(); //TODO: Agregar cartel de confirmación
    this.socket.emit('agregarAmigo',{friend: this.user, userToSend: suggestion.userId});
  }

  deleteFriend(suggestion: Usuario){
    this.cS.deleteFriend(this.user.userId, suggestion).subscribe(); //TODO: Agregar cartel de confirmación
    this.socket.emit('eliminarAmigo',{friend: this.user, userToSend: suggestion.userId});
  }

  buscar(){
    if(this.busqueda){
      setTimeout(() => {
        this.cS.searchUser(this.busqueda).subscribe(resp =>{
          this.suggestions = resp;
          this.noResults = false;
          if(this.suggestions.length === 0){
            this.noResults = true;
          }
        });
      }, 300);
    }else{
      this.noResults = false;
      this.suggestions = [];
    }
  }

}
