import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Livestream } from 'src/app/interfaces/livestream';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

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

  liked: boolean = false;
  disliked: boolean = false;

  likeState: string = "thumb_up_off_alt"
  dislikeState: string = "thumb_down_off_alt"


  @Input() inProfile: boolean = false;



  constructor(public db: DB) { }

  ngOnInit(): void {
    this.user = this.db.getUser(this.livestream.host)
    this.username = this.user.username;
    this.name = this.user.displayName;
    this.photoURL = this.livestream.photoURL; // **!!  HTML AVATAR NOTE  !!**
    this.title = this.livestream.title;
    this.views = this.livestream.views;
    this.likes = this.livestream.likes;
    this.dislikes = this.livestream.dislikes;
  }



  like() {
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";
      return;
    }
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";

    }
    this.liked = true;
    this.likeState = "thumb_up"
  }

  dislike() {
    if (this.disliked) {
      this.disliked = false;
      this.dislikeState = "thumb_down_off_alt";
      return
    }
    if (this.liked) {
      this.liked = false;
      this.likeState = "thumb_up_off_alt";

    }
    this.dislikeState = "thumb_down";
    this.disliked = true;
  }
}







