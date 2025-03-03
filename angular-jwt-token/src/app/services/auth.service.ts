import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresIn: number;
  description?: string;
} // LoginResponse

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
} // SignupRequest

interface SignupResponse {
  id: number;
  email: string;
  fullName: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.hasValidToken()) {
      this.getAuthenticatedUser();
    }
  } // constructor

  loginUser(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.API_URL + '/auth/login', loginData)
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token);
          this.isAuthenticatedSubject.next(true);
          this.getAuthenticatedUser();
        }),
        catchError((error) => {
          console.error('Login error: ', error);
          return of(error.error);
        })
      );
  } // loginUser

  getAuthenticatedUser(): Observable<any> {
    return this.http
      .get<any>(`${this.API_URL}/user/users/getAuthenticatedUser`)
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response);
          const isAdmin = !!response.authorities?.includes('ROLE_ADMIN');
          this.isAdminSubject.next(isAdmin);
        }),
        catchError((error) => {
          console.error('Errore nel recuperare i dati utente: ', error);
          return of(null); // Gestisci in modo grazioso
        })
      );
  } // getAuthenticatedUser

  logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.isAdminSubject.next(false); // Resetta lo stato di amministratore al logout
  } // logout

  signupUser(signupData: SignupRequest): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(this.API_URL + '/auth/signup', signupData)
      .pipe(
        tap((response) =>
          console.log('User signed up successfully: ', response)
        ),
        catchError((error) => {
          console.error('Signup error:', error);
          return of(error.error);
        })
      );
  } // signupUser

  private saveAuthData(token: string) {
    localStorage.setItem('authToken', token);
  } // saveAuthData

  private hasValidToken(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('authToken');

    if (!token) return false;

    return true;
  } // hasValidToken

  getAuthorizationToken(): string {
    return localStorage.getItem('authToken') || '';
  } // getAuthorizationToken

} // service
