import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DB } from 'src/app/services/database/DB';
import { Livestream } from '../../../interfaces/livestream';
import { LivestreamComponent } from '../../livestream/livestream.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { notificationType } from 'src/app/interfaces/User';
import { Router } from '@angular/router';

interface User {
  selected: boolean;
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-init-livestream-dialog',
  templateUrl: './init-livestream-dialog.component.html',
  styleUrls: ['./init-livestream-dialog.component.css']
})
export class InitLivestreamDialogComponent implements OnInit {
  privacyisChecked = false;
  saveisChecked = true;

  constructor(private fb: FormBuilder, public db: DB, public router: Router) { }
  title = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit(): void {
  }

  /**
   * initiate livestream entity
   * @param title string value that represents the title of the livestream
   * @param privacy boolean value of whether the livestream is public
   *                             or exclusive to followers
   */
  startLivestream(title, privacy?) {
    console.log(title, privacy);
    var livestream: Livestream = {
      lid: null,
      title: title,
      views: [],
      likes: [],
      dislikes: [],
      isActive: true,
      isPrivate: this.privacyisChecked,
      host: this.db.me.uid,
      photoURL: this.db.me.photoURL,
      date: new Date().getTime(),
    }
    this.db.saveLivestream(livestream).then((lid) => {
      this.db.me.followersUsers.forEach((follower) => {
        this.db.sendNotification(follower, this.db.me.uid, notificationType.INVITE, lid)
      })
      this.router.navigate(['/session/'+lid])
    })
  }
}
