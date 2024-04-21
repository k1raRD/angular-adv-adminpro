import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService
  ) {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerarModal();
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    if(!file) {
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
    reader.readAsDataURL(file);
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo: any = this.modalImagenService.tipo;

    this.fileUploadService
    .actualizarFoto(this.imagenSubir, tipo, id)
    .then(img => {
      this.cerrarModal();
      this.modalImagenService.nuevaImagen.emit(img);
      Swal.fire({
        title: "Success",
        text: "Imagen cambiada con exito",
        icon: 'success'
      })
    }).catch(err => {
      this.cerrarModal();
      Swal.fire({
        title: "Error",
        text: 'No se pudo subir la imagen',
        icon: 'error'
      })
    });
  }
}
