import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LivestreamComponent } from './components/livestream/livestream.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AnotherProfileComponent } from './components/another-profile/another-profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VerfiyEmailComponent } from './components/verfiy-email/verfiy-email.component';
import { DBTestComponent } from './dbtest/dbtest.component';
import { AuthGuard } from './guards/auth.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TrendComponent } from './components/trend/trend.component';
import { LivestreamGuard } from './guards/livestream.guard';
import { MessagesComponent } from './components/messages/messages.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'trend', component: TrendComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent},
  { path: 'messages/:cid', component: ChatComponent},
  { path: 'u/:username', component: AnotherProfileComponent },
  { path: 'session/:lid', component: LivestreamComponent },
  { path: 'db', component: DBTestComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerfiyEmailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'r/:type', component: RegistrationComponent },
  { path: 'profile/edit', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
