import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from '../follow-dialog/follow-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { Livestream } from 'src/app/interfaces/livestream';
import { Router } from "@angular/router";

// interface Livestream {
//   name: string;
//   username: string;
//   title: string;
//   // avatar: string;
//   views: number;
//   likes: number;
//   dislikes: number;
// }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  livestreamsList: Livestream[] = this.getMyLivestreams();

  constructor(public db: DB, public dialog: MatDialog, public router: Router,
  ) { }

  ngOnInit(): void {

    // console.log(this.num)

    // if (this.db.me) {
    //   this.name = this.db.me.displayName;
    //   this.username = '@' + this.db.me.username;
    //   this.bio = this.db.me.bio;
    // }
  }

  openDialogEdit() {
    let dialogRef = this.dialog.open(EditDialogComponent,
      {
        width: '400px',
        height: '500px',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  openDialogList(e, type, arr) {
    let dialogRef = this.dialog.open(FollowDialogComponent,
      {
        data: { 'type': type, 'arr': arr, 'db': this.db },
        width: '400px', height: '75vh'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  getMyLivestreams(): Livestream[] {
    var livestreams = [];
    this.db.me.livestreams?.forEach((lid) => {
      livestreams.push(this.db.getLivestream(lid))
    })
    return livestreams;
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}


