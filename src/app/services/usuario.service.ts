import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

const baseUrl = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone
  ) { 
    this.googleInit();
  }

   googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '905837725202-obbbt46dod62u7upn9unnc0sn3rihl3g.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve("a");
      });
    })
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${baseUrl}/login/renew`, {
      headers: {
        'Authorization': `Bearer ${token}`
      } 
    }).pipe(
      tap((resp: any)=> {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
  
   return this.http.post(`${baseUrl}/usuarios`, formData);

  }

  login(formData: any) {
  
    if(formData.rememberMe) {
      localStorage.setItem('email', formData.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(`${baseUrl}/login`, formData).pipe(
      tap((resp: any) =>  {
        localStorage.setItem('token', resp.token);
      })
    );
 
   }

   loginGoogle(token: any) {
    return this.http.post(`${baseUrl}/login/google`, {token}).pipe(
      tap((resp: any) =>  {
        localStorage.setItem('token', resp.token);
      })
    );
   }

   logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('login');
      })
    })
   }
}
