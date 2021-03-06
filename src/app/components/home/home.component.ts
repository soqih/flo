import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { window } from 'rxjs/operators';
import { Livestream } from 'src/app/interfaces/livestream';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // livestreamsList: Livestream[] = this.MyLivestreams;
  constructor(private route: Router, public authService: AuthService, public db: DB, private titleService:Title) { 
    this.titleService.setTitle("Home | Flo");
  }
  ngOnInit(): void {
  }

  

  get myLivestreams(): Livestream[] {
    var livestream;
    var livestreams = [];
    var user: User;
    // add following streams to the array
    this.db.me?.followingUsers?.forEach((uid) => {
      user = this.db.getUser(uid);
      user?.livestreams.forEach((lid) => {
        livestream = this.db.getLivestream(lid)
        if(livestream){
           livestreams.push(livestream)
        }
      });
    })
    // add me streams to the array
    this.db.me?.livestreams?.forEach((lid)=>{
      livestream = this.db.getLivestream(lid)
      if(livestream){
        livestreams.push(livestream)
     }
    })

    return livestreams.sort((a, b) => b.date - a.date);
  }
  scroll(){
    document.body.scrollTop = 0;
  }
}

