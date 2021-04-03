import { Component, Input, OnInit } from '@angular/core';
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

  constructor(public db: DB, public dialog: MatDialog) { }
  clicked:string ="home" ;

  @Input() where:string;

  ngOnInit(): void {
    console.log(this.where)
  }

  openDialog() {
    let dialogRef = this.dialog.open(InitLivestreamDialogComponent,
      {
        width: '400px',
        height: '600px',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
  itemClicked(item){
    // console.log(item)
    this.clicked = item
    // switch(item){
    //   case (item === "home"): {
    //     this.clicked = "home";
    //     break
    //   }
    //   case (item === "trend"): {
    //     this.clicked = "trend";
    //     break
    //   }
    //   case (item === "notification"): {
    //     this.clicked = "notification";
    //     break
    //   }
    //   case (item === "settings"): {
    //     this.clicked = "settings";
    //     break
    //   }
    // }
    console.log(this.clicked)
  }

}
