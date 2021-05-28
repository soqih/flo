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
  @ViewChild('Message') Message: ElementRef;
  constructor(public db:DB,private router:ActivatedRoute) {
  }
  sendMessage(message:string){
    this.db.sendMessage(this.cid,message);
    this.Message.nativeElement.scrollTop = this.Message.nativeElement.scrollHeight;

    this.Message.nativeElement.scrollBy(0, 100000);
  }
  ngOnInit(): void {
    this.Message.nativeElement.scrollBy(0, 10);

    this.cid = this.router.snapshot.paramMap.get('cid');
    // this.messages = this.db.getChat(this.cid).messages;
    this.amIp1 = this.db.getChat(this.cid).participant1UID === this.db.me.uid;
    // this.sendMessage('test');
  }

}
