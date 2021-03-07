import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InitLivestreamDialogComponent } from '../home/init-livestream-dialog/init-livestream-dialog.component';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
  
}
