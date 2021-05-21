import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';
// import { PwaService } from 'src/app/services/pwa.service';
import { BlockedDialogComponent } from '../blocked-dialog/blocked-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  promptEvent;
  constructor(public authService: AuthService, public db: DB, public dialog: MatDialog, private titleService:Title,
    //  public Pwa:PwaService
     ) {
    this.titleService.setTitle("Settings | Flo");
   }
   @HostListener('beforeinstallprompt', ['$event'])
   beforeInsall(event){
     event.preventDefault();
    this.promptEvent = event;
   }

  ngOnInit(): void {

  }

  installPwa(): void {
    this.promptEvent.prompt();
    // this.Pwa.promptEvent.prompt();
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
