import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';
import { BlockedDialogComponent } from '../blocked-dialog/blocked-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public authService: AuthService, public db: DB, public dialog: MatDialog, private titleService:Title) {
    this.titleService.setTitle("Settings | Flo");
   }

  ngOnInit(): void {
  }

  openDialog() {
    let dialogRef = this.dialog.open(BlockedDialogComponent,
      {
        width: '400px',
        height: '500px',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
  scroll(){
    document.body.scrollTop = 0;
  }
}
