import { Component, OnInit } from '@angular/core';
import { DB } from './../DB';

@Component({
  selector: 'app-dbtest',
  templateUrl: './dbtest.component.html',
  styleUrls: ['./dbtest.component.css']
})
export class DBTestComponent implements OnInit {

  constructor(private db: DB) { }

  ngOnInit(): void {
  }
  login() {
    this.db.login();
  }
}
