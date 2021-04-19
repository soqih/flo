import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})

export class TrendComponent implements OnInit {
  title = "trending"
  // livestreamsList: Livestream[] = this.MyLivestreams;
  constructor(private route: Router, public authService: AuthService, public db: DB, private titleService:Title) {
    this.titleService.setTitle("Trending | Flo");

   }
  ngOnInit(): void {
  }
  

  get myLivestreams(): Livestream[] {  
    var livestreams:Livestream[] = [];
    this.db.livestreamsCollection.forEach((livestream) => {
      if(!this.db.me){
        return;
      }
      if(livestream?.isPrivate ){
        if(this.db.me?.followingUsers?.includes(livestream.host)){
          livestreams.push(livestream)
        }
      }else{
        livestreams.push(livestream)
      } 
    });
    //sort
    livestreams = livestreams.sort((a,b)=>b.views.length - a.views.length)
    return livestreams ;
  }
}

