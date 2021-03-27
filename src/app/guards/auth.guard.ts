import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.isLoggedIn()
  }
  async isLoggedIn() {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.afAuth.authState.subscribe((user) => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate([''])
          resolve(false);
        }
      })

    });
  }
}
