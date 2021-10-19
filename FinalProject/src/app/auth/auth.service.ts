import { AuthData } from './auth-data.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined;

  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/users/signup", authData)
      .subscribe(response => {
        console.log(response);
      })
  } 

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/api/users/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      })
  }
}
