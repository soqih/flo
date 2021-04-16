import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Livestream } from 'src/app/interfaces/livestream';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';


// interface Livestream {
//   name: string;
//   username: string;
//   title: string;
//   // avatar: string;
//   views: number;
//   likes: number;
//   dislikes: number;
// }



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // livestreamsList: Livestream[] = this.MyLivestreams;
  constructor(private route: Router, public authService: AuthService, public db: DB) { }
  ngOnInit(): void {
  }


  get myLivestreams(): Livestream[] {
    var livestreams = [];
    var following: User[] = [];
    this.db.me?.followingUsers.forEach((uid) => {
      following.push(this.db.getUser(uid))
    })
    following?.forEach((user) => {
      user?.livestreams.forEach((lid) => {
        livestreams.push(this.db.getLivestream(lid))
      });
    })
    
    return  livestreams.sort((a,b) => b.date - a.date);
  }
}

