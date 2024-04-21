import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http: HttpClient) { }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return  {
      headers: {
        'Authorization': `Bearer ${this.token}`
      } 
    }
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {;
    console.log(resultados);
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', 
                          user.role, user.img, 
                          user.google, user['_id'])
    );
  }

  buscar(
    tipo: 'usuarios' | 'medicos'|'hospitales',
    termino: string
  ) {
    const url = `${baseUrl}/todo/colleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
            .pipe(
              map((resp: any) => {
                switch(tipo) {
                  case 'usuarios':
                    return this.transformarUsuarios(resp.resultados);
                  break;

                  default:
                    return []
                }
              })
            )
  }

}
