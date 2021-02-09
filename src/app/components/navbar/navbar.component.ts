import { Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor() {}
  isRow: boolean = true;
  // @ViewChild('navContainer') container;


  ngOnInit(): void {
   
  }

  DT() {
    this.isRow = !this.isRow;
    // if(this.isRow){

    // }else{
    
    // }
  }

}
