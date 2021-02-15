import { Component, OnInit } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';

interface User{
  disabled: boolean ;
  value: string ;
  viewValue: string ;
}

@Component({
  selector: 'app-init-live',
  templateUrl: './init-live.component.html',
  styleUrls: ['./init-live.component.css']
})
export class InitLiveComponent implements OnInit {

  isPrivate = false;

  allInvited = false;

  titleField = new FormControl('', [
    Validators.required
  ]);

  user = new FormControl();
  usersList: string[] = ['User1', 'User2', 'User3', 'User4'];

  // users: User[] = [
  //   {disabled: true , value: 'user-1' , viewValue: "user1"},
  //   {disabled: false , value: 'user-2' , viewValue: "user2"},
  //   {disabled: false , value: 'user-3' , viewValue: "user3"}
  // ]

  constructor() { }

  ngOnInit(): void {
  }

  allInvitedFunction(){
    this.allInvited = !this.allInvited ;
  }
}
