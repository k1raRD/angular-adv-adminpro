import { environment } from "src/environments/environment"

const baseUrl = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string ,
        public password?: string,
        public role?: string,
        public img?: string,
        public google?: boolean,
        public uid? : string,
    ) {}

    get imagenUrl() {
        if(!this.img) {
            return `${baseUrl}/uploads/usuarios/no-img.jpg`;
        } else if(this.img.includes('https')) {
            return this.img;
        } else if(this.img) {
            return `${baseUrl}/uploads/usuarios/${this.img}`
        } else{ 
            return `${baseUrl}/uploads/usuarios/no-img.jpg`
        }
    }
}