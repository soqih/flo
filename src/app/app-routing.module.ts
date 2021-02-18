import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InitLiveComponent } from './components/init-live/init-live.component';
import { LivestreamComponent } from './components/livestream/livestream.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DBTestComponent } from './dbtest/dbtest.component';


const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'start', component: InitLiveComponent },
  { path: 'session', component: LivestreamComponent },
  { path: 'db', component: DBTestComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
