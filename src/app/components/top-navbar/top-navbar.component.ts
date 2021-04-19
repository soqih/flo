import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DB } from 'src/app/services/database/DB';
import Fuse from 'fuse.js'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  public selection: string = 'users';

  constructor(public authService: AuthService,
    public db: DB, public dialog: MatDialog
  ) { }

  @ViewChild('filterDialog') filterDialog: TemplateRef<any>;
    usersIsChecked = true;
    LivestreamsIsChecked = false;
  usersoptions = {
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

  livestreamoptions = {
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
      "title",
      // "displayName",
    ]

  };


  // fuse = new Fuse(Array.from(this.db.usersCollection, ([key, value]) => value), this.options);
  users = new Fuse(Array.from(this.db.usersCollection, ([key, value]) => value), this.usersoptions);
  livestreams = new Fuse(Array.from(this.db.livestreamsCollection, ([key, value]) => value), this.livestreamoptions);

  // usersArray = Array.from(this.db.usersCollection, ([key, value]) => value);
  // livestreamsArray = Array.from(this.db.livestreamsCollection, ([key, value]) => value);


  // mixArray = [...this.usersArray, ...this.livestreamsArray]
  // mix = new Fuse(this.mixArray, this.options)

  searchFilter:string = "user";


  // test = this.fuse.search('test')
  items = [];
  search(pattern: any): void {
    if(this.searchFilter==="user"){
      this.items = this.users.search(pattern).slice(0, 15).map(({ item }) => item)
    }
    else if(this.searchFilter==="livestream"){
      this.items = this.livestreams.search(pattern).slice(0, 15).map(({ item }) => item)
    }
    
    // return this.fuse.search(pattern.target.value)
  }

  ngOnInit(): void {

  }

  openDialog() {
    let dialogRef = this.dialog.open(this.filterDialog,
      {
        width: '350px',
        height: '270px',

      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result)
    })
  }
  setFilter(){
    console.log(this.selection)
    if(this.selection === "users"){
      this.searchFilter = "user"
    }
    if(this.selection === "livestreams"){
      this.searchFilter = "livestream"
    }



  }
}
