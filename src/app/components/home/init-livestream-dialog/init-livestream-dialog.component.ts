import { Component, OnInit, ViewChild } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DB } from 'src/app/services/database/DB';
import { Livestream } from '../../../interfaces/livestream';
import { LivestreamComponent } from '../../livestream/livestream.component';
import {ErrorStateMatcher} from '@angular/material/core';

interface User {
  selected: boolean;
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-init-livestream-dialog',
  templateUrl: './init-livestream-dialog.component.html',
  styleUrls: ['./init-livestream-dialog.component.css']
})
export class InitLivestreamDialogComponent implements OnInit {
  privacyisChecked = false;
  saveisChecked = false;
  
  // myForm: FormGroup;

  // usersList: string[] = ['User1', 'User2', 'User3', 'User4'];

  usersList: Array<User> = [
    { selected: false, value: 'user-1', viewValue: "user1" },
    { selected: false, value: 'user-2', viewValue: "user2" },
    { selected: false, value: 'user-3', viewValue: "user3" },
  ]

  constructor(private fb: FormBuilder, public db: DB,/* private OV: LivestreamComponent*/) { }

   title = new FormControl('', [
      Validators.required,
    ]);

  ngOnInit(): void {
    //  console.log(this.userform.value)
    // this.myForm = this.fb.group({
    //   title: "",
    //   private: false,
    //   allowedFollowers: new FormArray([]),
    //   saveStream: false,
    // })
    // this.myForm.patchValue({allowedFollowers: this.usersList})
    // this.myForm.valueChanges.subscribe((data) => {
    //   this.formData = data;
    // });
  }

  startLivestream(title) {
    console.log(title,this.privacyisChecked,this.saveisChecked);
   // this.OV.createSession(undefined).then((sessionID: string) => {
      var livestream: Livestream = {
        lid: null,
        title: title,
        views: 0,
        likes: [],
        dislikes: [],
        isActive: true,
         isPrivate: this.privacyisChecked,
        saveStream: this.saveisChecked,
        host: this.db.me.uid,
        photoURL: this.db.me.photoURL,
      //  sessionID:sessionID
      }
      this.db.saveLivestream(livestream);
  //  })

  }

















  // onCheckChange(event) {
  //   // console.log(this.myForm.get("allowedFollowers"))
  //   if (event.isUserInput) {
  //     console.log(event);
  //     const formArray: FormArray = this.myForm.get('allowedFollowers') as FormArray;

  //     // check selected
  //     if (event.source.selected) {
  //       formArray.push(new FormControl(event.source.value));
  //     }

  //     // check unselected
  //     else {
  //       // find the unselected element
  //       let i: number = 0;
  //       formArray.controls.forEach((ctrl: FormControl) => {
  //         if (ctrl.value == event.source.value) {
  //           formArray.removeAt(i);
  //           return;
  //         }
  //         i += 1;
  //       })
  //     }

  //   }
  // }

}
