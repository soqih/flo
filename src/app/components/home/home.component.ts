import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  signed: boolean = false;
  navbarOpen = false;
  navbar;
  sticky;

  // toggleNavbar() {
  //   this.navbarOpen = !this.navbarOpen;
  // }
  constructor() { }
  ngAfterViewInit(): void {
    this.navbar = document.querySelector(".nav");
    this.sticky = this.navbar.offsetTop;
  }

  ngOnInit(): void {
  }
  clicked() {
    console.log('clic')
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {


    if (window.pageYOffset >= this.sticky) {
      this.navbar.classList.add("sticky")
    } else {
      this.navbar.classList.remove("sticky");
    }

  }


}
