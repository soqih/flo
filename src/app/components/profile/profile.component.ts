import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DB } from 'src/app/services/database/DB';
import { MatDialog } from '@angular/material/dialog';
import { FollowDialogComponent } from '../follow-dialog/follow-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { Livestream } from 'src/app/interfaces/livestream';
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  livestreamsList: Livestream[] = this.getMyLivestreams();

  constructor(public db: DB,
    public dialog: MatDialog,
    public router: Router,
    private titleService: Title,
    private location: Location,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {

    // console.log(this.num)

    // if (this.db.me) {
    //   this.name = this.db.me.displayName;
    //   this.username = '@' + this.db.me.username;
    //   this.bio = this.db.me.bio;
    // }
    if(this.route.snapshot.routeConfig.path.includes("edit")){
      this.openDialogEdit()
    }
      // console.log('yes')
    // console.log(this.route.snapshot.routeConfig.path)
    this.titleService.setTitle(this.db.me.username + " | Flo");


  }
  BackToLastPage() {
    this.location.back();
  }

  openDialogEdit() {
    let dialogRef = this.dialog.open(EditDialogComponent,
      {
        width: '400px',
        // height: '500px',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  openDialogList(type, arr) {
    let dialogRef = this.dialog.open(FollowDialogComponent,
      {
        data: { 'type': type, 'arr': arr, 'pending': this.db.me.pendingFollowers },
        width: '400px', height: '75vh'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  getMyLivestreams(): Livestream[] {
    var livestream;
    var livestreams = [];
    this.db.me.livestreams?.forEach((lid) => {
      livestream = this.db.getLivestream(lid);
      if (livestream) {
        livestreams.push(livestream)
      } else {
        console.log(lid + 'is not found')
      }

    })
    return livestreams.sort((a, b) => b.date - a.date);
  }
  deleteLivestream(lid) {
    this.db.deleteLivestream(lid)
    this.livestreamsList = this.livestreamsList.filter((l) => l.lid != lid)
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}


