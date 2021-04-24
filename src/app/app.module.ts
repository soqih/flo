import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
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
import { FollowDialogComponent } from './components/follow-dialog/follow-dialog.component';
import { EditDialogComponent } from './components/profile/edit-dialog/edit-dialog.component';
import { InitLivestreamDialogComponent } from './components/home/init-livestream-dialog/init-livestream-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationCardComponent } from './components/notifications/notification-card/notification-card.component';
import { BlockedDialogComponent } from './components/blocked-dialog/blocked-dialog.component';
import { TrendComponent } from './components/trend/trend.component';
import { UnsignedUserViewComponent } from './components/unsigned-user-view/unsigned-user-view.component';
import {AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { NoContentComponent } from './components/no-content/no-content.component';

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
    LivestreamComponent,
    DBTestComponent,
    ForgotPasswordComponent,
    VerfiyEmailComponent,
    SettingsComponent,
    AnotherProfileComponent,
    FollowDialogComponent,
    EditDialogComponent,
    InitLivestreamDialogComponent,
    NotificationsComponent,
    NotificationCardComponent,
    BlockedDialogComponent,
    TrendComponent,
    UnsignedUserViewComponent,
    NoContentComponent,
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
    AngularFireStorageModule,
    AngularFirestoreModule,
  ],
  providers: [AuthService,/* { provide: BUCKET, useValue: 'my-bucket-name' }*/  Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
