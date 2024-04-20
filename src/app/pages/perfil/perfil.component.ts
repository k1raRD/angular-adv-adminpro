import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit{
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  
  constructor(private fb: FormBuilder, 
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.email]]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe({
        next: (resp: any) => {
          const {nombre, email} = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;
          Swal.fire({
            title: "Success",
            text: "Usuario actualizado con exito.",
            icon: 'success'
          })
        },
        error: err => {
          Swal.fire({
            title: "Error",
            text: err.error.msg,
            icon: 'error'
          })
        }
      });
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if(!file) {return this.imgTemp = null;}

    const reader = new FileReader();

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => {
      this.usuario.img = img;
      Swal.fire({
        title: "Success",
        text: "Imagen cambiada con exito",
        icon: 'success'
      })
    }).catch(err => {
      Swal.fire({
        title: "Error",
        text: 'No se pudo subir la imagen',
        icon: 'error'
      })
    });
  }
}
