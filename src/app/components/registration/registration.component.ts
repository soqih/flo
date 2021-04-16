import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationDialogComponent } from './registration-dialog/registration-dialog.component';
import { DB } from '../../services/database/DB';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  imageNumber: number = 1;
  constructor(
    public dialog: MatDialog,
    public db: DB,
    public authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      if (this.imageNumber == 1)
        this.imageNumber = 2;
      else if (this.imageNumber == 2)
        this.imageNumber = 3
      else if (this.imageNumber == 3)
        this.imageNumber = 1;

    }, 4000)
    if (this.route.snapshot.params && this.route.snapshot.params['type'] == 'signin') {
      this.openDialog('', 'signin')
    } else if (this.route.snapshot.params && this.route.snapshot.params['type'] == 'signup') {
      this.openDialog('', 'signup')
    }
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
