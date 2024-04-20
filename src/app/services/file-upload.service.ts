import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    arcvhivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    try {
      const url = `${baseUrl}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      const token = localStorage.getItem('token') || '';
      formData.append('imagen', arcvhivo);

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await resp.json();

      if(data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false
      }

    } catch(error) {
      console.log(error)
      return false;
    }
  }
}
