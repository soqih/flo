import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-stream-card',
  templateUrl: './stream-card.component.html',
  styleUrls: ['./stream-card.component.css']
})
export class StreamCardComponent implements OnInit {

  @Input() username: string;
  @Input() name: string;
  @Input() avatar: string;
  @Input() title: string;
  @Input() views: number;
  @Input() likes: number;
  @Input() dislikes: number;

  liked: boolean = false;
  disliked: boolean = false;

  likeState: string = "thumb_up_off_alt"
  dislikeState: string = "thumb_down_off_alt"

  @ViewChild("likeIcon") likeIcon: ElementRef;
  constructor() { }
  ngOnInit(): void {
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







