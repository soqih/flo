import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InitLivestreamDialogComponent } from '../home/init-livestream-dialog/init-livestream-dialog.component';
//import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Output() scrollEvent: EventEmitter<void> = new EventEmitter();

  constructor(public db: DB, public dialog: MatDialog) { }
  clicked: string = "home";
  home = "home";
  trend = "trend";
  notification = "notification";
  messages = "messages"


  @Input() where: string;

  ngOnInit(): void {
    if (this.where === "home")
      this.home = "homeClicked"
    else if (this.where === "trend")
      this.trend = "trendClicked"

    else if (this.where === "notification")
      this.notification = "notificationClicked"
    else if (this.where === "messages")
      this.messages = "messagesClicked"

    console.log(this.where)
  }

  openDialog() {
    let dialogRef = this.dialog.open(InitLivestreamDialogComponent,
      {
        width: '400px',
        // height: '500px',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
  itemClicked(item) {
    if(item=== this.where){
      // window.scrollBy(0,10000)
      this.scrollEvent.emit()
    }
    // console.log(item)
    // this.clicked = item
    // console.log(this.clicked)
  }

}
