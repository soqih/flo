import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DB } from 'src/app/services/database/DB';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';   //   import <<<<

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  haveUpdated: boolean = false;


  basePath = '/profileImages';                       //  <<<<<<<
  downloadableURL = '';                      //  <<<<<<<
  task: AngularFireUploadTask;               //  <<<<<<<


  constructor(public db: DB, private fireStorage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  editProfile(name, bio) {
    // data.name coming from profile component,check that somthing is chnaged
    if (this.db.me.displayName !== name) {
      this.db.updateMyData({ 'displayName': name })
      console.log("update name")
    }
    if (this.db.me.bio !== bio) {
      this.db.updateMyData({ 'bio': bio })
      console.log("update Bio")
    }
  }

  // to prevent user from submit without updating somthing
  changed(s) {
    this.haveUpdated = true;
    console.log(s)
  }






  async onFileChanged(event) {
    this.haveUpdated = true;

    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${this.db.me.username}`;  // path at which image will be stored in the firebase storage
      this.task = this.fireStorage.upload(filePath, file);    // upload task
      // this.db.updateMyData({ 'photoURL': filePath });
      // this.progress = this.snapTask.percentageChanges();


      (await this.task).ref.getDownloadURL().then(url => {
        this.db.updateMyData({ 'photoURL': url });
        this.downloadableURL = url;
      });  // <<< url is found here

    } else {
      alert('No images selected');
      this.downloadableURL = '';
    }
  }




}