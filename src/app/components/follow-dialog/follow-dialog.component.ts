import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-follow-dialog',
  templateUrl: './follow-dialog.component.html',
  styleUrls: ['./follow-dialog.component.css']
})
export class FollowDialogComponent implements OnInit {


  @Input() followingList: User[];
  @Input() followersList: User[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: {} }, private dialogRef: MatDialogRef<FollowDialogComponent>) { }
  isFollowers: boolean = this.data['type'] == 'followers';
  arr: [] = this.data['arr'];
  db = this.data['db']

  ngOnInit(): void {
  }
  closeDialog(){
    this.dialogRef.close();
  }

}