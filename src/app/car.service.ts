import { Injectable } from '@angular/core';
/** To connect with backend */
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Car } from './car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  baseUrl = 'http://localhost/api';
  cars: Car[];

  constructor(private http: HttpClient) { }

  getAll(): Observable<Car[]> {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res) => {
        this.cars = res['data'];
        return this.cars;
      }),
      catchError(this.handleError));
  }

  store(car: Car): Observable<Car[]> {
    return this.http.post(`${this.baseUrl}/store.php`, { data: car })
      .pipe(map((res) => {
        this.cars.push(res['data']);
        return this.cars;
      }),
        catchError(this.handleError));
  }

  update(car: Car): Observable<Car[]> {
    return this.http.put(`${this.baseUrl}/update.php`, { data: car })
      .pipe(map((res) => {
        const theCar = this.cars.find((item) => {
          return +item['id'] === +car['id'];
        });
        if (theCar) {
          theCar['price'] = +car['price'];
          theCar['model'] = car['model'];
        }
        return this.cars;
      }),
        catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    console.log(error);

    // return an observable with a user friendly message
    return throwError('Error! something went wrong.');
  }
}
