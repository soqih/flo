import { Component, Input, OnInit } from '@angular/core';
import { Livestream } from 'src/app/interfaces/livestream';
import { notification, User, notificationType } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css'],
})
export class NotificationCardComponent implements OnInit {
  constructor(private db: DB) {}
  @Input() notification: notification;
  user: User;
  livestream: Livestream;
  text: string;
  icon:string;
  isInvitation:boolean;
  // displayName:string;
  // username:string;
  // bio:string;
  // photoURL:string;
  ngOnInit(): void {
    this.isInvitation =this.notification?.type === notificationType.INVITE; 
    this.user = this.db.getUser(this.notification?.uid);
     this.livestream = this.db.getLivestream(this.notification.lid);
    var title = !this.livestream? '' :this.livestream.title
    if (this.notification?.type === notificationType.LIKE) {
      this.text = ' liked your livestream ' + title;
      this.icon = 'thumb_up';
    } else if (this.notification?.type === notificationType.FOLLOW) {
      console.log(this.notification?.type)
      this.text = ' followed you';
      this.icon = 'person_add'
    } else {
      this.text = ' started a new livestream ' + title;
      this.icon = 'notifications_active';
    }
  }
  
}
