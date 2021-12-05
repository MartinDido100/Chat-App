import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserSearched } from '../../interfaces/chat.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../auth/interfaces/auth.interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  busqueda: string = '';
  suggestions: UserSearched[] = [];
  noResults: boolean = false;
  constructor(private cS: ChatService,
              private aS: AuthService) { }


  get user(): Usuario{
    return this.aS.user;
  }

  get friends(): Usuario[]{
    return this.cS.friends;
  }

  isNotFriend(username: string){
    return this.friends.findIndex(friend => friend.username === username) === -1;
  }

  getLiClass(suggestion: UserSearched){
      return suggestion.username === this.user.username ? 'disabled' : 'suggestions_li';
  }

  addFriend(suggestion: UserSearched){
    this.cS.addFriend(this.user.userId, suggestion).subscribe(); //TODO: Agregar cartel de confirmación
  }

  deleteFriend(suggestion: UserSearched){
    this.cS.deleteFriend(this.user.userId, suggestion).subscribe(); //TODO: Agregar cartel de confirmación
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
