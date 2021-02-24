import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { InitLiveComponent } from './components/init-live/init-live.component';
import { LivestreamComponent } from './components/livestream/livestream.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VerfiyEmailComponent } from './components/verfiy-email/verfiy-email.component';
import { DBTestComponent } from './dbtest/dbtest.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'start', component: InitLiveComponent },
  { path: 'session', component: LivestreamComponent },
  { path: 'db', component: DBTestComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerfiyEmailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
