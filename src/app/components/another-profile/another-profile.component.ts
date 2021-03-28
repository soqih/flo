import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from './follow-dialog/follow-dialog.component';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { ThrowStmt } from '@angular/compiler';
import { Router } from "@angular/router";
import { Livestream } from 'src/app/interfaces/livestream';
import { exit } from 'process';



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
  livestreamsList: Livestream[];
  image: string = "<img ... />"

  constructor(
    public db: DB,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
  ) {
    // this.route.params.subscribe( params => this.params = params['username'] )
    this.params = this.route.snapshot.params['username'];
    this.anotherUser = this.db.getUser(this.params);
    this.livestreamsList = this.getMyLivestreams();
    // this.livestreamsList: Livestream[] = this.getMyLivestreams();

    // this.livestreamsList = this.getMyLivestreams();
  }

  // check if this page is the logged-in users' page
  // and check if its another user and is blocking the logged-in user

  ngOnInit(): void {
    if (this.params == this.db.me.uid) {
      this.router.navigate(['/profile']);
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  followUnfollow() {
    // console.log(this.youAreFollower)
    if (!this.db.me.followingUsers?.includes(this.anotherUser.uid)) {
      console.log("following")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
      }).then(() => { this.anotherUser = this.db.getUser(this.params); })
    } else {
      console.log("unfollowing")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.anotherUser = this.db.getUser(this.params); })
    }
    // this.reloadComponent();

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

  blockUnblock() {
    if (!this.isBlocked()) {
      this.db.updateMyData({
        blockingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        blockedFromUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
      })
    } else {
      this.db.updateMyData({
        blockingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        blockedFromUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
    }
  }

  isBlocked() {
    return this.db.me.blockingUsers?.includes(this.anotherUser.uid);
  }

  isBlockedMe() {
    console.log(this.db.me.blockedFromUsers?.includes(this.anotherUser.uid))
    return this.anotherUser.blockingUsers?.includes(this.db.me.uid);
  }

}
