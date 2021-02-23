import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  constructor(private route: Router, public authService: AuthService) { }

  livestreamsList: Livestream[] = [
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "AAA", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 }
  ]

  ngOnInit(): void {
    // this.route.routeReuseStrategy.shouldReuseRoute = () => false
  }

}
