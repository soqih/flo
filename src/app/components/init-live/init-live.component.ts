import { Component, OnInit } from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

interface User{
  selected: boolean;
  value: string ;
  viewValue: string ;
}

@Component({
  selector: 'app-init-live',
  templateUrl: './init-live.component.html',
  styleUrls: ['./init-live.component.css']
})
export class InitLiveComponent implements OnInit {

  // isPrivate = true;

  // allInvited = false;

  // titleField = new FormControl('', [
  //   Validators.required
  // ]);

  // userform = new FormControl();
  myForm: FormGroup;

 // usersList: string[] = ['User1', 'User2', 'User3', 'User4'];

  usersList: Array<User> = [
    { selected: false, value: 'user-1' , viewValue: "user1"},
    { selected: false, value: 'user-2' , viewValue: "user2"},
    { selected: false, value: 'user-3' , viewValue: "user3"},
  ]

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  //  console.log(this.userform.value)
    this.myForm = this.fb.group({
      title: "",
      private: false,
      allowedFollowers: new FormArray([]),
      saveStream: false,
    })
    // this.myForm.patchValue({allowedFollowers: this.usersList})
    this.myForm.valueChanges.subscribe(console.log);
  }
  
  onCheckChange(event) {
    // console.log(this.myForm.get("allowedFollowers"))
    if (event.isUserInput){
      console.log(event);
      const formArray: FormArray = this.myForm.get('allowedFollowers') as FormArray;
      
      // check selected
      if (event.source.selected){
        formArray.push(new FormControl(event.source.value));
      }
  
      // check unselected
      else {
        // find the unselected element
        let i: number = 0;
        formArray.controls.forEach((ctrl: FormControl) => {
          if (ctrl.value == event.source.value) {
            formArray.removeAt(i);
            return;
          }
          i+=1;
        })
      }

    }
  }
}
