import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { RegistrationDialogComponent } from './components/registration/registration-dialog/registration-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }
}
