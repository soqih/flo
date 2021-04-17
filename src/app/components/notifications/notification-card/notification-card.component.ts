import { Component, Input, OnInit } from '@angular/core';
import { Livestream } from 'src/app/interfaces/livestream';
import { notification, User ,notificationType} from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  constructor(private db: DB) { }
  @Input() notification: notification;
  user: User;
  livestream: Livestream;
  text: string;
  // displayName:string;
  // username:string;
  // bio:string;
  // photoURL:string;
  ngOnInit(): void {

    this.user = this.db.getUser(this.notification?.uid);
    if (this.notification?.type === notificationType.LIKE) {
      this.livestream = this.db.getLivestream(this.notification.lid)
      if (this.livestream) {
        this.text = ' liked your livestream ' + this.livestream.title;
      }
    } else if(this.notification?.type === notificationType.FOLLOW) {
      this.text = ' followed you'
    }else{
      this.text = ' Started a new livestream ' + this.livestream.title;
      
    }
  }

}
