import { Component, OnInit } from '@angular/core';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name: string = "Abdullah ibrahim";
  username: string = "@abdullah";
  bio: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!";
  numFollowing: number = 5;
  numFollowers: number = 6;
  image: string = "<img ... />" //??

  livestreamsList: Livestream[] = [
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 }
  ]

  constructor() { }

  ngOnInit(): void {
  }


}
