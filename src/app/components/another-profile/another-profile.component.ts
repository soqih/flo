import { Component, OnInit } from '@angular/core';
import { notification, notificationType, User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from '../follow-dialog/follow-dialog.component';
import { Location } from '@angular/common';
import firebase from 'firebase';
import { Router } from "@angular/router";
import { Livestream } from 'src/app/interfaces/livestream';
import { Title } from '@angular/platform-browser';



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
    private titleService: Title,
    private location: Location,
  ) {
    this.route.params.subscribe((params) => {
      this.params = params['username'];
      if ( this.params== this.db.me?.uid) {
        this.router.navigate(['/profile']);
      }
      this.anotherUser = this.db.getUser(this.params);
      this.livestreamsList = this.getMyLivestreams();
    });


    this.titleService.setTitle(this.anotherUser.username + " | flo");
  }
  BackToLastPage() {
    this.location.back();
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
    if (!this.db.me.followingUsers?.includes(this.anotherUser.uid)) {
      console.log("following")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid)
      })
      //
      if (!this.followedMeBefore(this.anotherUser.notifications, this.db.me.uid)) {
        this.db.sendNotification(this.anotherUser.uid, this.db.me?.uid, notificationType.FOLLOW)
      }

      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid),
      }).then(() => {
         this.anotherUser = this.db.getUser(this.params);
         this.livestreamsList = this.getMyLivestreams();
        })


    } else {
      console.log("unfollowing")
      this.db.updateMyData({
        followingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => {
         this.anotherUser = this.db.getUser(this.params);
         this.livestreamsList = this.getMyLivestreams();
        })
    }
    // this.reloadComponent();

  }

  openDialog(e, type, arr) {
    let dialogRef = this.dialog.open(FollowDialogComponent,
      {
        data: { 'type': type, 'arr': arr, 'db': this.db },
        width: '400px', height: '75vh'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  getMyLivestreams(): Livestream[] {
    var livestream
    var livestreams = [];
    this.anotherUser.livestreams?.forEach((lid) => {
      livestream = this.db.getLivestream(lid)

      if (livestream?.isPrivate) {
        if (this.db.me?.followingUsers?.includes(livestream.host)) {
          livestreams.push(livestream)
        }
      } else {
        if(livestream){
          livestreams.push(livestream)
        }else{
          console.log('lid: ',lid)
        }
      }
    })
    return livestreams.sort((a, b) => b.date - a.date);
  }

  blockUnblock() {
    if (!this.isBlocked()) {
      this.db.updateMyData({
        blockingUsers: firebase.firestore.FieldValue.arrayUnion(this.anotherUser.uid),
        // remove blocked user from your followings
        followingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid),
      })
      this.db.updateUser(this.anotherUser.uid, {
        blockedFromUsers: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
      }).then(() => { this.anotherUser = this.db.getUser(this.params); })
      // remove you from user followers
      this.db.updateUser(this.anotherUser.uid, {
        followersUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.anotherUser = this.db.getUser(this.params); })
    } else {
      this.db.updateMyData({
        blockingUsers: firebase.firestore.FieldValue.arrayRemove(this.anotherUser.uid)
      })
      this.db.updateUser(this.anotherUser.uid, {
        blockedFromUsers: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.anotherUser = this.db.getUser(this.params); })
    }
  }

  isBlocked() {
    return this.db.me.blockingUsers?.includes(this.anotherUser.uid);
  }

  isBlockedMe() {
    console.log(this.db.me.blockedFromUsers?.includes(this.anotherUser.uid))
    return this.anotherUser.blockingUsers?.includes(this.db.me.uid);
  }
  followedMeBefore(notifications: notification[], uid: string): boolean {
    if (!notifications) {
      return;
    }
    const now = new Date().getTime();
    const threeDaysInMs = 86400000 * 1;
    console.log(now)
    for (var i = 0; i < notifications.length; i++) {
      if (notifications[i].uid === uid && notifications[i].type === notificationType.FOLLOW && now - notifications[i].date < threeDaysInMs) {
        return true;
      }
    }
    return false;
  }
}
