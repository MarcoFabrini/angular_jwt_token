import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listAllUsers() {
    return this.http.get(this.API_URL + '/admin/users/listAllUsers');
  } // listAllUsers
} // service
