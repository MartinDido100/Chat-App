import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = this.fB.group({
    username:[],
    email:[],
    password:[],
    confirmP:[]
  })

  constructor(private fB: FormBuilder) { }

  ngOnInit(): void {
  }

}
