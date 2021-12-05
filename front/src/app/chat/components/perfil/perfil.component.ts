import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  get friends(){
    return this.chS.friends
  }

  get user() {
    return this.aS.user;
  }

  constructor(private chS: ChatService,
              private aS : AuthService) { }

  ngOnInit(): void {}

}
