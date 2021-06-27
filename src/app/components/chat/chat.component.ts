import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/interfaces/chat';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // messages:Message[];
  cid:string;
  amIp1:boolean;
  constructor(public db:DB,private router:ActivatedRoute) {
  }
  sendMessage(message:string){
    this.db.sendMessage(this.cid,message);
    
  }
  ngOnInit(): void {
    window.scrollBy(0,-50000)
    this.cid = this.router.snapshot.paramMap.get('cid');
    // this.messages = this.db.getChat(this.cid).messages;
    this.amIp1 = this.db.getChat(this.cid).participant1UID === this.db.me.uid;
    // this.sendMessage('test');
  }

}
