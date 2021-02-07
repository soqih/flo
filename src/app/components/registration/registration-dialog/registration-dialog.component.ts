import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  email = new FormControl('', [Validators.email]);

  ngOnInit(): void {
  }
  getErrorMessage() {
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
