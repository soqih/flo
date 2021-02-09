import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationDialogComponent } from './registration-dialog/registration-dialog.component';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  imageNumber: number = 1;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    setInterval(() => {
      if (this.imageNumber == 1)
        this.imageNumber = 2;
      else if (this.imageNumber == 2)
        this.imageNumber = 3
      else if (this.imageNumber == 3)
        this.imageNumber = 1;

    }, 4000)
  }
  openDialog(e,type) {
    if(type=='signup')
    e.preventDefault();
    
    
    let dialogRef = this.dialog.open(RegistrationDialogComponent,
      {
        data:{type},
        width: '400px',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

}
