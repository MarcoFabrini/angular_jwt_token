import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ProvaComponent } from './components/prova/prova.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthGuard } from './services/guards/auth.guard';
import { AdminGuard } from './services/guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard/home' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // pages
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'dashboard', component: DashboardComponent, 
        children: [
          // components
          { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
          { path: 'user', component: UserOptionsComponent, canActivate: [AuthGuard]},
          { path: 'home', component: HomeComponent },
          { path: 'prova', component: ProvaComponent },
        ],
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
