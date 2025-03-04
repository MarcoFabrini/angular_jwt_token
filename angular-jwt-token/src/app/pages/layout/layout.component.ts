import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: false,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  opened: boolean = false;
  menuTooltip: string = 'Open menu';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Sottoscrive al BehaviorSubject per aggiornare la navbar dinamicamente
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
      // Controlla se l'utente è admin
      this.authService.isAdmin$.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    });
  } // ngOnInit

  openMenu() {
    this.opened = !this.opened;
    this.menuTooltip = this.opened ? 'Close menu' : 'Open menu';
  } // openMenu

  logout() {
    this.authService.logout();
    this.navigateToHome();
  } // logout

  navigateToLogin() {
    this.router.navigate(['/login']);
  } // navigateToLogin

  navigateToAdminPanel() {
    this.router.navigate(['/dashboard/admin']);
  } // navigateToAdminPanel

  navigateToUserOptions() {
    this.router.navigate(['/dashboard/user']);
  } // navigateToUserOptions

  navigateToHome() {
    this.router.navigate(['/dashboard/home']);
  } // navigateToHome

  navigateToProva() {
    this.router.navigate(['/dashboard/prova']);
  } // navigateToProva
} // class
