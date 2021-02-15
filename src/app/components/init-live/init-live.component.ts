import { Component, OnInit } from '@angular/core';

import {FormControl, Validators} from '@angular/forms';

interface User{
  selected: boolean ;
  value: string ;
  viewValue: string ;
}

@Component({
  selector: 'app-init-live',
  templateUrl: './init-live.component.html',
  styleUrls: ['./init-live.component.css']
})
export class InitLiveComponent implements OnInit {

  isPrivate = true;

  allInvited = false;

  titleField = new FormControl('', [
    Validators.required
  ]);

  userform = new FormControl();

 // usersList: string[] = ['User1', 'User2', 'User3', 'User4'];

  usersList: User[] = [
    {selected: false , value: 'user-1' , viewValue: "user1"},
    {selected: true , value: 'user-2' , viewValue: "user2"},
    {selected: false , value: 'user-3' , viewValue: "user3"}
  ]

  constructor() { }

  ngOnInit(): void {
  //  console.log(this.userform.value)
    
  }

  setUser(user){
    this.allInvited = false;
    // this.userform.
    user.selected = !user.selected;
  }

  onClear() {
    for (let user of this.usersList) {
      user.selected = false;
    }
  }

  allInvitedFunction(){
    if (this.allInvited){
      this.userform.setValue([])
    } else {
      let arr = ["All"]
      for (let user of this.usersList) {
        arr.push(user.value)
      }
      this.userform.setValue(arr);
    }
    this.allInvited = !this.allInvited;
  }
}
