import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit{
  
  constructor() {}

  ngOnInit(): void {

    this.getUsuarios().then(console.log);
    this.getUsuarios();

    // const promesa = new Promise((resolve, reject) => {
    //   if(false) {
    //     resolve("Hola Mundo");
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });

    // promesa
    // .then((s) => {
    //   console.log('Hey termine')
    //   console.log(s);
    // })
    // .catch(error => {
    //   console.log("error en mi promesa", error);
    // });

    // console.log("Fin del init")

  }

  getUsuarios() {
    const promesa = new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
    });

    return promesa;
  }
}
