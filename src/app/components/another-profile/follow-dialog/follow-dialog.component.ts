import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-follow-dialog',
  templateUrl: './follow-dialog.component.html',
  styleUrls: ['./follow-dialog.component.css']
})
export class FollowDialogComponent implements OnInit {
followingList: User[];

followersList: Array<User> = [
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
  { displayName: "Test", uid: "test", email:"test@test.com", emailVerified:true, bio:"testttttt", photoURL:"teksdopksdo" },
]

  constructor(@Inject(MAT_DIALOG_DATA)public data: {type: string}) { }

  ngOnInit(): void {
  }

}
