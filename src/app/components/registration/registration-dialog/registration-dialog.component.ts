import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/interfaces/User';


@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {
  user: User

  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: string },
    public authService: AuthService) { }

  email = new FormControl('', [Validators.email]);
  isSignup: boolean = this.data.type == 'signup';
  ngOnInit(): void {

  }
  getErrorMessage() {
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  signIn(username, password) {
    this.authService.SignIn(username, password);
  }
  signUp(email, username, name, password, confirmPassword) {
    if (password === confirmPassword)
      this.authService.SignUp(email, username, name, password)
    else
      alert("passwords not match")

  }

}
