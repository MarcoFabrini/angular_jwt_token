import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: false,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  opened: boolean = false;
  menuTooltip: string = 'Open menu';

  ngOnInit(): void {
    // Sottoscrive al BehaviorSubject per aggiornare la navbar dinamicamente
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;

      // Controlla se l'utente è admin
      this.authService.isAdmin().subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    });
  } // ngOnInit

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']); // Naviga alla home dopo il logout
  } // logout

  navigateToLogin() {
    this.router.navigate(['/login']);
  } // navigateToLogin

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  } // navigateToDashboard

  navigateToAdminPanel(){
    
  }

  openMenu() {
    this.opened = !this.opened;
    this.menuTooltip = this.opened ? 'Close menu' : 'Open menu'; // Aggiorna il testo dinamicamente
  }
}// class
