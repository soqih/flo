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
  // numFollowing: number = 0;
  // numFollowers: number = 0;
  // youAreFollower: boolean = false;
  image: string = "<img ... />" //??

  livestreamsList: Livestream[];

  constructor(
    public db: DB,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
  ) {
    // this.route.params.subscribe( params => this.params = params['username'] )
    this.params = this.route.snapshot.params['username'];
    this.anotherUser = this.db.getUser(this.params);
    // this.livestreamsList = this.getMyLivestreams();
  }


  // check if this page is the logged-in users' page
  // and check if its another user and is blocking the logged-in user

  ngOnInit(): void {

  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  followUnfollow() {
    // console.log(this.youAreFollower)
    if (!this.db.me.followingUsers.includes(this.anotherUser.uid)) {
      console.log("following")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
      })
    } else {
      console.log("unfollowing")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
    }
    this.reloadComponent();
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
    return this.db.me.blockingUsers.includes(this.anotherUser.uid);
  }


}
