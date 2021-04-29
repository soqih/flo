import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth/auth.service';
import { DB } from './services/database/DB';
import { PwaService } from './services/pwa.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  constructor(public dialog: MatDialog, public db: DB, public auth: AuthService, ) { }

  ngOnInit() {
  }
  get isLoaded(): boolean {
    return this.auth.isLoggedIn != null && this.db.livestreamsCollection != null && this.db.usersCollection != null;

    // return true;
  }
}
