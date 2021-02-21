import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { DB } from './../DB';

@Component({
  selector: 'app-dbtest',
  templateUrl: './dbtest.component.html',
  styleUrls: ['./dbtest.component.css']
})
export class DBTestComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {

  }
}
