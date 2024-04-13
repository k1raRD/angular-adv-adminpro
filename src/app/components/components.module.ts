import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonutComponent } from './donut/donut.component';
import { BaseChartDirective } from 'ng2-charts';



@NgModule({
  declarations: [
    IncrementadorComponent,
    DonutComponent
  ],
  exports: [
    IncrementadorComponent,
    DonutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ]
})
export class ComponentsModule { }
