import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Livestream } from 'src/app/interfaces/livestream';
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



  // @Input() signed: boolean;
  // navbarOpen = false;
  // navbar;
  // sticky;

  // toggleNavbar() {
  //   this.navbarOpen = !this.navbarOpen;
  // }
  constructor(private route: Router, public authService: AuthService, public db: DB) { }

  livestreamsList: Livestream[] = [];

  ngOnInit(): void {
    this.db.livestreamsCollection.forEach((l) => {
      this.livestreamsList.push(l)
    })
    // this.route.routeReuseStrategy.shouldReuseRoute = () => false
  }




}
