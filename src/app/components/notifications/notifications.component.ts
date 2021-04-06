import { Component, OnInit } from '@angular/core';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(public db: DB) { }
  get notifications(): any[] {
    return this.db.me.notifications;
  }
  ngOnInit(): void {
  }
  getUser(notification) {
    return this.db.getUser(notification.uid);
  }
}
