import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string = localStorage.getItem('email') || '';
  public auth2: any;

  public loginForm = this.fb.group({
    email: [this.email, [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: false
  });

  constructor(private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.renderButton();

    if (this.email.length > 1) {
      this.rememberMe.setValue(true);
    }
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  login() {
    this.usuarioService.login(this.loginForm.value)
      .subscribe({
        next: ok => {
          this.router.navigateByUrl('/dashboard');
        },
        error: err => {
          Swal.fire({
            title: 'Error',
            text: err.error.msg,
            icon: 'error'
          })
        }
      })
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp()
  }

  async startApp() {
    
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));  
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const idToken = googleUser.getAuthResponse().idToken;
        this.usuarioService.loginGoogle(idToken).subscribe(res => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/dashboard');
          })
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }
}
