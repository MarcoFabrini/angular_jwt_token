import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

}// service
