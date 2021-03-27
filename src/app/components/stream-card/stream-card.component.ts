import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import firebase from 'firebase/app';
import { Livestream } from 'src/app/interfaces/livestream';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { AngularFirestore } from '@angular/fire/firestore';

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

  userlink: string = '';


  @Input() inProfile: boolean = false;



  constructor(public db: DB) { }

  ngOnInit(): void {
    this.user = this.db.getUser(this.livestream.host)
    this.username = this.user?.username;
    this.name = this.user?.displayName;
    this.photoURL = this.livestream.photoURL; // **!!  HTML AVATAR NOTE  !!**
    this.title = this.livestream.title;
    this.views = this.livestream.views;
    this.likes = this.livestream.likes.length;
    this.dislikes = this.livestream.dislikes.length;
    this.userlink = '/u/' + this.user.uid;
    try {
      this.liked = this.livestream.likes?.includes(this.db.me.uid) || false
      this.disliked = this.livestream.dislikes?.includes(this.db.me.uid) || false
    } catch (e) {
      this.liked = false
      this.disliked = false
    }
    this.likeState = this.liked ? 'thumb_up' : 'thumb_up_off_alt';
    this.dislikeState = this.disliked ? 'thumb_down' : 'thumb_down_off_alt';

  }



  like() {

    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      // remove like from db
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      return;
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
    }
    this.liked = true;
    this.likeState = "thumb_up"
    // add like to db
    this.db.updateLivestream(this.livestream.lid, {
      likes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    })
    console.log(this.user.uid, this.livestream.lid)
  }

  dislike() {
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      // remove dislike from db
      this.db.updateLivestream(this.livestream.lid, {
        dislikes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      return
    }
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      this.db.updateLivestream(this.livestream.lid, {
        likes: firebase.firestore.FieldValue.arrayRemove(this.db.me.uid)
      })
      // 
    }
    this.dislikeState = "thumb_down";
    this.disliked = true;
    this.db.updateLivestream(this.livestream.lid, {
      dislikes: firebase.firestore.FieldValue.arrayUnion(this.db.me.uid)
    })

  }

}







