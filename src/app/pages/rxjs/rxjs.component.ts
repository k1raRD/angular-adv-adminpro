import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {
    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe({
    //   next: val => {
    //     console.log("Subs:", val)
    //   },
    //   error: err => {
    //     console.log("err: ", err)
    //   },
    //   complete: () => console.log("Obs terminado")
    // });

    this.intervalSubs = this.retornaIntervalo()
      .subscribe(console.log)
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    return interval(250).pipe(
      // map(valor => 'Hola Mundo ' + (valor + 1)),
      map(valor => valor + 1),
      filter(v => v % 2 == 0),
      // take(10)
    );
  }

  retornaObservable(): Observable<number> {
    let i = 0;
    return new Observable<number>(observer => {
      const intervalo = setInterval(() => {

        console.log('tick');
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i == 2) {
          observer.error('i llego al valor de 2')
        }
      }, 1000)
    });
  }
}
