import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InitLivestreamDialogComponent } from '../home/init-livestream-dialog/init-livestream-dialog.component';
//import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  constructor(public db: DB, public dialog: MatDialog, private route: ActivatedRoute,) { }
  clicked: string = "home";
  home = "home";
  trend = "trend";
  notification = "notification";
  settings = "settings"


  @Input() where: string;

  ngOnInit(): void {
    console.log(this.route.snapshot.routeConfig.component.name)
    if (this.route.snapshot.routeConfig.path.includes("home")){
      this.home = "homeClicked"
    }
    if (this.route.snapshot.routeConfig.path.includes("trend")){
        this.trend = "trendClicked"
    }
    if(this.route.snapshot.routeConfig.path.includes("notifications")){
      this.notification = "notificationClicked"
    }

    if(this.route.snapshot.routeConfig.path.includes("settings")){
      this.settings = "settingsClicked"
    }

    // if (this.where === "home")
    //   this.home = "homeClicked"
    // else if (this.where === "trend")
    //   this.trend = "trendClicked"

    // else if (this.where === "notification")
    //   this.notification = "notificationClicked"
    // else if (this.where === "settings")
    //   this.settings = "settingsClicked"

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
    // console.log(item)
    this.clicked = item
    console.log(this.clicked)
  }

}
