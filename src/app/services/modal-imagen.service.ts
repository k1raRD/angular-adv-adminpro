import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: string;
  public img?: string;
  public id: string;

  public nuevaImagen: EventEmitter<string> =  new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if(img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${baseUrl}/uploads/${tipo}/${img}`
    }
  }

  cerarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
