import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{

  public cargando: boolean = true;
  public medicos: Medico[] = []
  public medicosTemp: Medico[] = []
  public imagenSub: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService
  ) {}
  
  ngOnInit(): void {
    this.cargarMedicos();
    
    this.imagenSub = this.modalImagenService.nuevaImagen
    .subscribe(img => {
      this.cargarMedicos();
    })
  }

  ngOnDestroy(): void {
    this.imagenSub.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
    .subscribe({
      next: medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {
    if(termino.trim().length === 0) {
      this.medicos = [...this.medicosTemp]
    }

    this.busquedaService.buscar('medicos', termino)
      .subscribe(result => {
        this.medicos = result;
      })
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
          this.cargarMedicos();
          Swal.fire({
            title: "Deleted!",
            text: `${medico.nombre} fue eliminado correctamente`,
            icon: "success"
          });
        });
      }
    });
  }
}
