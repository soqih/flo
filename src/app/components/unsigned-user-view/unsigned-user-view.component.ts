import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationDialogComponent } from '../registration/registration-dialog/registration-dialog.component';

@Component({
  selector: 'app-unsigned-user-view',
  templateUrl: './unsigned-user-view.component.html',
  styleUrls: ['./unsigned-user-view.component.css']
})
export class UnsignedUserViewComponent implements OnInit {

  constructor(public authService: AuthService,public dialog: MatDialog,) { }

  ngOnInit(): void {
  }
  openDialog(e, type) {
    if (type == 'signup') {
      // console.log(e)
      if (e)
        e.preventDefault();
    }


    let dialogRef = this.dialog.open(RegistrationDialogComponent,
      {
        data: { type },
        width: '400px',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}
