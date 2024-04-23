import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuario' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return `${baseUrl}/uploads/usuarios/no-img.jpg`;
    } else if (img.includes('https')) {
      return img;
    } else if (img) {
      return `${baseUrl}/uploads/${tipo}/${img}`
    } else {
      return `${baseUrl}/uploads/usuarios/no-img.jpg`
    }
  }

}
