import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }
  
  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }
  }

  cargarMedicos(desde: number = 0) {
    const url = `${baseUrl}/medicos`;
    return this.http.get(url, this.headers)
          .pipe(
            map((resp: {ok: boolean, medicos: Medico[]}) => resp.medicos)
          );
  }

  obtenerMedicoById(id: string) {
    const url = `${baseUrl}/medicos/${id}`;
    return this.http.get(url, this.headers)
          .pipe(
            map((resp: {ok: boolean, medico: Medico}) => resp)
          );
  }

  crearMedico(medico: {nombre: string, hospital: string}) {
    const url = `${baseUrl}/medicos`;
    return this.http.post(url, medico,this.headers);
   }

   actualizarMedico(medico: Medico) {
    const url = `${baseUrl}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
   }

   eliminarMedico(id: string) {
    const url = `${baseUrl}/medicos/${id}`;
    return this.http.delete(url, this.headers);
   }
}
