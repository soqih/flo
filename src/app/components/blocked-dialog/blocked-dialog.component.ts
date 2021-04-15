import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-blocked-dialog',
  templateUrl: './blocked-dialog.component.html',
  styleUrls: ['./blocked-dialog.component.css']
})
export class BlockedDialogComponent implements OnInit {

  constructor(public db: DB) { }
  arr : String[] ;
  ngOnInit(): void {
    this.arr = this.db.me?.blockingUsers;
  }
  unblock(uid:string){
    this.db.updateMyData({
      blockingUsers: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    this.db.updateUser(uid, {
      blockedFromUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
    })
  }

}
