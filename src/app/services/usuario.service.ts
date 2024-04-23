import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import Swal from 'sweetalert2';

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

  get role(): string {
    return this.usuario.role;
  }

  get uid() {
    return this.usuario.uid || '';
  }

  get headers() {
    return  {
      headers: {
        'Authorization': `Bearer ${this.token}`
      } 
    }
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

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
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
        this.guardarLocalStorage(resp.token, resp.menu);
        return true
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
  
   return this.http.post(`${baseUrl}/usuarios`, formData)
          .pipe(
            tap((resp: any) => {
              this.guardarLocalStorage(resp.token, resp.menu);
            }));

  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}) {

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: any) {
  
    if(formData.rememberMe) {
      localStorage.setItem('email', formData.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(`${baseUrl}/login`, formData).pipe(
      tap((resp: any) =>  {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
 
   }

   loginGoogle(token: any) {
    return this.http.post(`${baseUrl}/login/google`, {token}).pipe(
      tap((resp: any) =>  {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
   }

   logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('login');
      })
    })
   }

   cargarUsuarios(desde: number = 0): Observable<CargarUsuario> {
    const url = `${baseUrl}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
          .pipe(
            map(resp => {
              const usuarios = resp.usuarios
                                   .map(user => new Usuario(user.nombre, user.email, '', user.role, user.img, user.google, user['_id']))
              return {
                usuarios,
                total: resp.total
              };
            })
          )
   }

   eliminarUsuario(usuario: Usuario) {
    console.log(usuario);
    const url = `${baseUrl}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
   }

   actualizarUsuario(data: Usuario) {

    return this.http.put(`${baseUrl}/usuarios/${data.uid}`, data, this.headers);

  }
}
