import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UserProfileComponent } from './pages/users/user-profile/user-profile.component';
import { AddressListComponent } from './pages/addresses/address-list/address-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent },
  { path: ':id/profile', component: UserProfileComponent },
  { path: 'addresses', component: AddressListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
