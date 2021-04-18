import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DB } from '../services/database/DB';


@Injectable({
  providedIn: 'root'
})
export class LivestreamGuard implements CanActivate {
  constructor(public db:DB,){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //   const lid = route.params['lid'];
    //   const livestream = this.db.getLivestream(lid);
    //   const host = this.db.getUser(livestream.host);


    // return !livestream.isPrivate || host.followersUsers.includes(this.db.me.uid) || livestream.host === this.db.me.uid
    return true; 
  }
  // allowed(){
  //   return new Promise<boolean>((resolve, reject) => {
      
      
  //   });
    
  // }

}
