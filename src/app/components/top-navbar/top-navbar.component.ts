import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';
import Fuse from 'fuse.js'

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  constructor(public authService: AuthService,
    public db: DB
  ) { }

  options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.0,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
    keys: [
      "username",
      "displayName",
    ]
  
  };

  fuse = new Fuse(Array.from(this.db.usersCollection, ([key, value]) => value), this.options);



  // test = this.fuse.search('test')
  items = [];
  search(pattern: any): void {
    this.items = this.fuse.search(pattern.target.value).slice(0, 15).map(({ item }) => item)
    // return this.fuse.search(pattern.target.value)
  }

  ngOnInit(): void {

  }

}
