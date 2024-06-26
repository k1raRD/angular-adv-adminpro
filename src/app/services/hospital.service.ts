import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(desde: number = 0) {
    const url = `${baseUrl}/hospitales`;
    return this.http.get(url, this.headers)
          .pipe(
            map((resp: {ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
          );
   }

   crearHospital(nombre: string) {
    const url = `${baseUrl}/hospitales`;
    return this.http.post(url, {nombre},this.headers);
   }

   actualizarHospital(id: string, nombre: string) {
    const url = `${baseUrl}/hospitales/${id}`;
    return this.http.put(url, {nombre}, this.headers);
   }

   eliminarHospital(id: string) {
    const url = `${baseUrl}/hospitales/${id}`;
    return this.http.delete(url, this.headers);
   }
}
