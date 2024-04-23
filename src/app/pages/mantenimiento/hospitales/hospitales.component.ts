import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;

  public imagenSub: Subscription;


  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService
  ) {}
  
  ngOnInit(): void {
    this.cargando = true
    this.cargarHospitales();
    
    this.imagenSub = this.modalImagenService.nuevaImagen
    .subscribe(img => {
      this.cargarHospitales();
    })
  }
  
  ngOnDestroy(): void {
    this.imagenSub.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
    .subscribe(hospitales => {
      this.cargando = false
      this.hospitales = hospitales
      this.hospitalesTemp = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
    .subscribe(resp => {
      Swal.fire({
        title: "Success",
        text: "Hospital actualizo exitosamente",
        icon: 'success'
      });
    })
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospital(hospital._id)
    .subscribe(resp => {
      this.cargarHospitales();
      Swal.fire({
        title: "Success",
        text: "Hospital eliminado exitosamente",
        icon: 'success'
      });
    })
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      inputLabel: "Ingrese el nombre del nuevo Hospital",
      input: "text",
      inputPlaceholder: "nombre",
      showCancelButton: true
    });
    
    if(value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
      .subscribe(resp => {
        Swal.fire({
          title: 'Success',
          text: "Hospital creado con exito.",
          icon: 'success'
        })
        this.cargarHospitales()
      })
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscarHospial(termino: string) {
    if(termino.trim().length === 0) {
      this.hospitales = [...this.hospitalesTemp]
    }

    this.busquedaService.buscar('hospitales', termino)
      .subscribe(result => {
        this.hospitales = result;
      })
  }
}
