import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RegistrationDialogComponent } from './components/registration/registration-dialog/registration-dialog.component';
import { HomeComponent } from './components/home/home.component';

import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StreamCardComponent } from './components/stream-card/stream-card.component';
import { InitLiveComponent } from './components/init-live/init-live.component';
/*  openVidu  */
import { OpenviduSessionModule } from 'openvidu-angular';
import { LivestreamComponent } from './components/livestream/livestream.component';
/*  firebase  */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { DBTestComponent } from './dbtest/dbtest.component';
import { AuthService } from "./services/auth/auth.service";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerfiyEmailComponent } from './components/verfiy-email/verfiy-email.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AnotherProfileComponent } from './components/another-profile/another-profile.component';
import { FollowDialogComponent } from './components/another-profile/follow-dialog/follow-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    RegistrationDialogComponent,
    HomeComponent,
    TopNavbarComponent,
    ToolBarComponent,
    ProfileComponent,
    StreamCardComponent,
    InitLiveComponent,
    LivestreamComponent,
    DBTestComponent,
    ForgotPasswordComponent,
    VerfiyEmailComponent,
    SettingsComponent,
    AnotherProfileComponent,
    FollowDialogComponent,
  ],
  entryComponents: [RegistrationDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OpenviduSessionModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
