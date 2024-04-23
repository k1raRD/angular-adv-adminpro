import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { authGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimiento/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimiento/medicos/medicos.component';
import { MedicoComponent } from './mantenimiento/medicos/medico.component';


const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de Cuenta'}},
            { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
            { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Graficas'}},
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},
            { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'}},

            // Mantenimiento
            { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Usuarios de la aplicacion'}},
            { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Hospitales de la aplicacion'}},
            { path: 'medicos', component: MedicosComponent, data: {titulo: 'Medicos de la aplicacion'}},
            { path: 'medicos/:id', component: MedicoComponent, data: {titulo: 'Editar Medico'}},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
