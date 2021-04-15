import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import firebase from 'firebase/app';
import { Livestream } from 'src/app/interfaces/livestream';
import { User, notification } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stream-card',
  templateUrl: './stream-card.component.html',
  styleUrls: ['./stream-card.component.css']
})
export class StreamCardComponent implements OnInit {
  // @Input() livestream : Livestream;
  // @Input() username: string;
  // @Input() name: string;
  // @Input() photoURL: string; // **!!  HTML AVATAR NOTE  !!**
  // @Input() title: string;
  // @Input() views: number;
  // @Input() likes: number;
  // @Input() dislikes: number;



  @ViewChild("likeIcon") likeIcon: ElementRef;

  @Input() livestream: Livestream;
  user: User;
  username: string;
  name: string;
  photoURL: string; // **!!  HTML AVATAR NOTE  !!**
  title: string;
  views: number;
  likes: number;
  dislikes: number;

  liked: boolean;
  disliked: boolean;

  likeState: string;
  dislikeState: string;

  userlink: string;
  livestreamURL: string;


  @Input() inProfile: boolean = false;



  constructor(public db: DB, public router: Router) { }

  ngOnInit(): void {
    this.user = this.db.getUser(this.livestream.host)
    this.username = this.user?.username;
    this.name = this.user?.displayName;
    this.photoURL = this.livestream.photoURL; // **!!  HTML AVATAR NOTE  !!**
    // if(this.livestream.title.length>20){
    //   this.title = this.livestream.title.substring(0, 19) + "...";
    // }
    // else{
      this.title = this.livestream.title;
    // }
    // this.title = this.livestream.title;
    this.views = this.livestream.views;
    this.likes = this.livestream.likes.length;
    this.dislikes = this.livestream.dislikes.length;
    this.userlink = this.db.me?.uid == this.user.uid ? '/profile' : '/u/' + this.user.uid;
    this.livestreamURL = '/session/' + this.livestream.lid

    this.liked = this.livestream.likes?.includes(this.db.me?.uid) || false
    this.disliked = this.livestream.dislikes?.includes(this.db.me?.uid) || false

    this.likeState = this.liked ? 'thumb_up' : 'thumb_up_off_alt';
    this.dislikeState = this.disliked ? 'thumb_down' : 'thumb_down_off_alt';


  }



  like(event: Event) {
    event.stopPropagation();
    if (this.db?.me == undefined) {
      return
    }

    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      // remove like from db
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.updateLivestream() })
      return;
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.updateLivestream() })
    }
    this.liked = true;
    this.likeState = "thumb_up"
    // add like to db
    this.db.updateLivestream(this.livestream.lid, {
      likes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    }).then(() => { this.updateLivestream() })
    this.db.updateUser(this.user.uid, {
      notifications: firebase.firestore.FieldValue.arrayUnion({ uid: this.db.me.uid, isItLike: true, date: new Date().getTime(), hasSeen: false, lid: this.livestream.lid })
    })
    // var x: notification = { uid: this.db.me.uid, isItLike: true, date: new Date().getTime(), hasSeen: false, lid: this.livestream.lid }
  }

  dislike(event: Event) {
    event.stopPropagation();
    if (this.db?.me == undefined) {
      return
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.updateLivestream() })
      return
    }
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      }).then(() => { this.updateLivestream() })
      this.livestream = this.db.getLivestream(this.livestream.lid);
    }
    this.dislikeState = "thumb_down";
    this.disliked = true;
    this.db.updateLivestream(this.livestream.lid, {
      dislikes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    }).then(() => { this.updateLivestream() })

  }
  updateLivestream() {
    this.livestream = this.db.getLivestream(this.livestream.lid);
  }
  navgateToStream(url: string, event: Event) {
    event.stopPropagation();
    if(this.db?.me){
      this.router.navigate([url])
    } else{
      this.router.navigate([""])
    }
  }

  navgateToUser(url: string, event: Event) {
    event.stopPropagation();
    this.router.navigate([url])
  }
   
  
  deleteLivestream(lid){
      console.log(lid)
         this.db.deleteLivestream(lid)
  }
}







