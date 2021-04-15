import { Component, OnInit } from '@angular/core';
import { notification, User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(public db: DB) { }
  get notifications(): notification[] {
    return this.db.me.notifications?.sort((a, b) => b.date - a.date);
  }
  // get unseenNotifications(): notification[] {
  //   return this.db.me.notifications.filter((n) => !n.hasSeen)
  // }

  ngOnInit(): void {
    this.db.updateMyData({
      notifications: this.notifications.filter((n) => {
        n.hasSeen = true;
        return n;
      })
    })
  }
  getUser(notification) {
    return this.db.getUser(notification.uid);
  }
}
