import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { Livestream } from 'src/app/interfaces/livestream';

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
  name: string = "Abdullah ibrahim";
  username: string = "@abdullah";
  bio: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!";
  numFollowing: number = 0;
  numFollowers: number = 0;
  image: string = "<img ... />" //??
  num = 1;
  livestreamsList: Livestream[] = this.getMyLivestreams();

  constructor(public db: DB, public dialog: MatDialog,) { }

  ngOnInit(): void {
    console.log(this.num)

    // if (this.db.me) {
    //   this.name = this.db.me.displayName;
    //   this.username = '@' + this.db.me.username;
    //   this.bio = this.db.me.bio;
    // }
  }
  openDialog() {
    let dialogRef = this.dialog.open(EditDialogComponent,
      {
        width: '400px',
        height: '500px',

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
}


