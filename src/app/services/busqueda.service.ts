import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

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

  private transformarHospitales(resultados: any[]): Hospital[] {;
    return resultados.map(
      hosp => new Hospital(hosp.nombre, hosp._id, hosp.img, null)
    );
  }

  private transformarMedicos(resultados: any[]): Medico[] {;
    return resultados.map(
      medico => new Medico(medico.nombre, medico._id, medico.img, null)
    );
  }

  buscar(
    tipo: 'usuarios' | 'medicos'|'hospitales',
    termino: string
  ): any {
    const url = `${baseUrl}/todo/colleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
            .pipe(
              map((resp: any) => {
                switch(tipo) {
                  case 'usuarios':
                    return this.transformarUsuarios(resp.resultados);
                  break;
                  case 'hospitales':
                    return this.transformarHospitales(resp.resultados)
                  break;
                  case 'medicos':
                    return this.transformarMedicos(resp.resultados)
                  break;
                  default:
                    return []
                }
              })
            )
  }

}
