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
/*openVidu*/
import { OpenviduSessionModule } from 'openvidu-angular';
import { LivestreamComponent } from './components/livestream/livestream.component';

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
  ],
  entryComponents: [RegistrationDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OpenviduSessionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
