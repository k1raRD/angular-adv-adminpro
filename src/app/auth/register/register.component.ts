import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

/**
 * Clase componente para el registro de usuario.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted: boolean = false;

  public registerForm = this.fb.group({
    nombre: ['Alex', [Validators.required, Validators.minLength(3)]],
    email: ['alex@mail.com', [Validators.required, Validators.email]],
    password: ['12345678', [Validators.required, Validators.minLength(6)]],
    password2: ['12345678', [Validators.required, Validators.minLength(6)]],
    terminos: [true, Validators.required]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }
  
  /**
   * Funcion que se ejecuta al hacer submit para crear un usuario.
   * @returns 
   */
  crearUsuario() {
    this.formSubmitted = true;
    if(this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe({
          next: resp => {
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            })
          }
        });
  }

  /**
   * Funcion generica para mostrar el mensaje de error si un campo no es valido.
   * @param campo nombre del campo a validar.
   * @returns boolean
   */
  campoNoValido(campo: string): boolean {
    return this.registerForm.get(campo)!.invalid && this.formSubmitted;
  }

  /**
   * Funcion que valida si el los terminos y condiciones estan activos.
   * @returns 
   */
  aceptaTerminos(): boolean {
    return !this.registerForm.get('terminos')!.value && this.formSubmitted;
  }

  /**
   * Funcion que permie mostrar mensaje en caso de que las passwords no sean iguales.
   * @returns boolean
   */
  passwordsNoValidas(): boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return pass1 !== pass2 && this.formSubmitted;
  }

  /**
   * Funcion que permite validar si las passwords son iguales.
   * @param pass1Name nombre del campo del primer password.
   * @param pass2Name nombre del campo del segundo password.
   * @returns La referencia de la funcion con la logica de validacion.
   */
  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({noEsIgual: true})
      }
    }
  }
}