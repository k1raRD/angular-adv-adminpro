import { Component, Input } from '@angular/core';
import { ChartData, Color } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [
  ]
})
export class DonutComponent {

    @Input() title: string = "Ventas";
    @Input() sales: any;

    public colors: Color[] =  [
      '#9E120E', 
      '#FF5800', 
      '#FFB414'
    ]
}
