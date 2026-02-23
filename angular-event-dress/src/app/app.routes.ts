import { Routes } from '@angular/router';
import { ListModelsComponent } from './components/list-models-component/list-models-component';
import { UserRegisterComponent } from './components/user-register-component/user-register-component';
import { UserLoginComponent } from './components/user-login-component/user-login-component';
import { UserUpdateComponent } from './components/user-update-component/user-update-component';
import { UserProfileComponent } from './components/user-profile-component/user-profile-component';
import { AdminComponent } from './components/admin-component/admin-component';
import { AdminUsersComponent } from './components/admin-users-component/admin-users-component';

export const routes: Routes = [
  { path: '', component: ListModelsComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'personal', component: UserProfileComponent },
  { path: 'update-profile', component: UserUpdateComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/users', component: AdminUsersComponent }
];
