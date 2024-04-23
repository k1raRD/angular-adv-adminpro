import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({id}) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      hospital: ['', [Validators.required]]
    })

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
    .pipe(
      delay(100)
    )
    .subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(hosp => hosp._id === hospitalId);
    });
  }

  cargarMedico(id: string) {

    if(id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoById(id)
    .subscribe(({ok, medico}) => {

      if(!ok) {
        this.router.navigateByUrl('/dashboard/medicos');
        return;
      }

      const {nombre, hospital:{_id}} = medico
      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({nombre, hospital: _id});
    })
  }

  cargarHospitales() {

    this.hospitalService.cargarHospitales()
    .subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico() {
    if(this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
      .subscribe((resp: {ok: boolean, medico: Medico}) => {
        Swal.fire({
          title: 'Medico Actualizado!',
          text: 'Medico actualizado exitosamente',
          icon: 'success'
        })
        this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`)
      })

    } else {

      this.medicoService.crearMedico(this.medicoForm.value)
      .subscribe((resp: {ok: boolean, medico: Medico}) => {
        Swal.fire({
          title: 'Medico Creado!',
          text: 'Medico creado exitosamente',
          icon: 'success'
        })
        this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`)
      })

    }
  }
}
