import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private route: Router) { }


  ngOnInit(): void {
    // this.route.routeReuseStrategy.shouldReuseRoute = () => false
  }

}
