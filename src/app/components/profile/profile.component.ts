import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

interface Livestream {
  name: string;
  username: string;
  title: string;
  // avatar: string;
  views: number;
  likes: number;
  dislikes: number;
}

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

  livestreamsList: Livestream[] = [
    { name: "A", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2, dislikes: 1 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -53440, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 }
  ]

  constructor(private db: DB, public dialog: MatDialog,) { }

  ngOnInit(): void {
    if (this.db.me) {
      this.name = this.db.me.displayName;
      this.username = '@' + this.db.me.username;
    }
  }
  openDialog() {
    let dialogRef = this.dialog.open(EditDialogComponent,
      {
        data: { name: this.name, bio: this.bio /*image: this.image , birthDate:this.birthDate */ },
        width: '400px',
        height: '500px'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }


}
