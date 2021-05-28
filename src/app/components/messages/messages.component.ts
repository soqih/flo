import { Component, OnInit } from '@angular/core';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public db:DB) { 
    

  }
  scroll(){
    document.body.scrollTop = 0;
  }
  ngOnInit(): void {
  }

}
