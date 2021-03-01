import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  haveUpdated: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string, bio: string /* image:string birthDate:date */ },) { }



  ngOnInit(): void {
  }

  editProfile(name, bio) {

    if (this.data.name !== name) {
      console.log("update name")
    }
    if (this.data.bio !== bio) {
      console.log("update Bio")
    }
  }
  changed(s) {
    this.haveUpdated = true;
    console.log(s)
  }

}
