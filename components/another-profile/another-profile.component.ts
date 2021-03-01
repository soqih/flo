import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { DB } from 'src/app/services/database/DB';
import {ActivatedRoute} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from './follow-dialog/follow-dialog.component';
import { Observable } from 'rxjs';
import firebase from 'firebase';

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
  selector: 'app-another-profile',
  templateUrl: './another-profile.component.html',
  styleUrls: ['./another-profile.component.css']
})
export class AnotherProfileComponent implements OnInit {
  params: string;
  anotherUser:Observable<firebase.firestore.DocumentSnapshot<User>>;
  user:User ;
  name: string = "none";
  username: string = "@none";
  bio: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, tempora!";
  numFollowing: number = 0;
  numFollowers: number = 0;
  image: string = "<img ... />" //??

  livestreamsList: Livestream[] = [
    { name: "A", username: "A", title: "ABC", /* avatar: string , */ views: -500, likes: -2, dislikes: 1 },
    { name: "BBB", username: "B", title: "ABC", /* avatar: string , */ views: -53440, likes: -2000, dislikes: 10000 },
    { name: "CCC", username: "C", title: "ABC", /* avatar: string , */ views: -500, likes: -2000, dislikes: 10000 }
  ]

  constructor(private db:DB, private route: ActivatedRoute,public dialog: MatDialog, ) { 
    // this.route.params.subscribe( params => this.params = params['username'] )
    this.params =this.route.snapshot.params['username'];
  }


  ngOnInit(): void {
    this.anotherUser = this.db.afs.doc<User>(`users/${this.params}`).get();
    this.anotherUser.subscribe(function(doc){
      if (doc.exists){
        this.user = doc.data();
        this.name = this.user.displayName;
      console.log("found user", this.name)
      } else {
        console.log("user not found")
      }      
    }, function(error){
      console.log(error)
    })
  }

  
  openDialog(e, type) {
    let dialogRef = this.dialog.open(FollowDialogComponent,
      {
        data: { type },
        width: '400px',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }


}
