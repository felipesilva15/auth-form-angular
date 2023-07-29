import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router) { }

  public sign(payload: { email: string, password: string }): Observable<any> {
    return this.http.post<{ access_token: string, expires_in: number, token_type: string }>(`${this.url}/sign`, payload).pipe(
      map((res) => {
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', res.access_token)

        return this.router.navigate(['admin']);
      }),
      catchError((err) => {
        if(err.error.message) {
          return throwError(() => err.error.message);
        }

        return throwError(() => 'Um erro inesperado ocorreu. Tente novamente mais tarde!');
      })
    );
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration_date');

    return this.router.navigate(['']);
  }

  public isAutheticated(): boolean {
    const token: string | null = localStorage.getItem('access_token');

    if(!token) {
      return false;
    }

    const jwtHelper: JwtHelperService = new JwtHelperService();

    return !jwtHelper.isTokenExpired(token);
  }
}
