import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from './follow-dialog/follow-dialog.component';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { ThrowStmt } from '@angular/compiler';

interface Livestream {
  name: string;
  username: string;
  title: string;
  // avatar: string;
  views: number;
  likes: number;
  dislikes: number;
}

@Component({
  selector: 'app-another-profile',
  templateUrl: './another-profile.component.html',
  styleUrls: ['./another-profile.component.css'],
})
export class AnotherProfileComponent implements OnInit {
  params: string;
  anotherUser: User;
  user: User;
  name: string = "none";
  username: string = "@none";
  bio: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!";
  numFollowing: number = 0;
  numFollowers: number = 0;
  youAreFollower: boolean = false;
  image: string = "<img ... />" //??

  livestreamsList: Livestream[];

  constructor(public db: DB, private route: ActivatedRoute, public dialog: MatDialog,) {
    // this.route.params.subscribe( params => this.params = params['username'] )
    this.params = this.route.snapshot.params['username'];
    this.anotherUser = this.db.getUser(this.params);
    this.livestreamsList = this.getMyLivestreams();
  }

  // getUser(uid:string){
  //   return this.db.getUser(uid);
  // }
  ngOnInit(): void {
    // this.getAnotherUser();
    // this.f2();
  }

  getAnotherUser() {
    var t0 = performance.now()
    this.anotherUser = this.db.getUser(this.params);
    var t1 = performance.now()
    console.log("Call with Map took " + (t1 - t0) + " milliseconds.")
    this.numFollowing = this.anotherUser.followersUsers.length;
    this.numFollowers = this.anotherUser.followersUsers.length;
    this.youAreFollower = this.anotherUser.followersUsers.includes(this.db.me.uid);

  }

  f2() {
    var t0 = performance.now()
    this.anotherUser = this.db.getUser2(this.params);
    var t1 = performance.now()
    console.log("Call with afs  took " + (t1 - t0) + " milliseconds.")
    // console.log(this.anotherUser)
  }

  followUnfollow() {
    if (!this.youAreFollower) {
      console.log("following")
      console.log(this.db.me)
      // this.db.updateMyData({'followingUsers': this.db.getMyData().followingUsers.concat(this.anotherUser.uid)})
      // this.db.updateUser(this.anotherUser.uid, {'followersUsers': this.anotherUser.followersUsers.concat(this.db.getMyData().uid)})
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
      })
    } else {
      console.log("unfollowing")
      console.log(this.db.me)
      // this.db.updateMyData({'followingUsers': this.db.me.followingUsers.concat(this.anotherUser.uid)})
      // this.db.updateUser(this.anotherUser.uid, {'followersUsers': this.anotherUser.followersUsers.concat(this.db.me.uid)})
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
    }
  }

  openDialog(e, type, arr) {
    let dialogRef = this.dialog.open(FollowDialogComponent,
      {
        data: { 'type': type, 'arr': arr, 'db': this.db },
        width: '400px',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  getMyLivestreams(): Livestream[] {
    var livestreams = [];
    this.anotherUser.livestreams?.forEach((lid) => {
      livestreams.push(this.db.getLivestream(lid))
    })
    return livestreams;
  }

}
