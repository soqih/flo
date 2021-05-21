import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-follow-dialog',
  templateUrl: './follow-dialog.component.html',
  styleUrls: ['./follow-dialog.component.css']
})
export class FollowDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: {} },
    private dialogRef: MatDialogRef<FollowDialogComponent>,
    public db: DB
  ) { }
  isFollowers: boolean = this.data['type'] == 'followers';
  arr: string[] = this.data['arr'];
  // db = this.data['db']
  penddingFollowers: string[] = this.data['pending'] || [];
  followersAndPending: string[];
  ngOnInit(): void {

  }
  accept(uid: string) {
    this.db.updateMyData({
      followersUsers: firebase.firestore.FieldValue.arrayUnion(uid)
    })

    this.db.updateUser(uid, {
      followingUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid),
    })

    this.removeUserFromPending(uid)
    this.arr.push(uid)
  }
  reject(uid: string) {
    this.removeUserFromPending(uid)
  }
  removeUserFromPending(uid: string) {
    this.penddingFollowers = this.penddingFollowers.filter((u) => u != uid)
    this.db.updateMyData({ pendingFollowers: firebase.firestore.FieldValue.arrayRemove(uid) })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}