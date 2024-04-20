import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone
  ) { 
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get uid() {
    return this.usuario.uid || '';
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
    return this.http.get(`${baseUrl}/login/renew`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      } 
    }).pipe(
      map((resp: any)=> {
        const {email, nombre, google, role, _id, password, img = ''} = resp.usuario;
        this.usuario = new Usuario(nombre, email, password, role, img, google, _id);
        localStorage.setItem('token', resp.token);
        return true
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
  
   return this.http.post(`${baseUrl}/usuarios`, formData);

  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}) {

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      } 
    });

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
