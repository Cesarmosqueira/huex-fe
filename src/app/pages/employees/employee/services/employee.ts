import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {BaseService} from 'src/app/shared/utils/base-service';
import {ResponseModel} from 'src/app/shared/utils/response-model';
import {environment} from '../../../../../environments/environment';
import {Employee} from '../models/employee';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  public listEmployees(): Observable<ResponseModel<Employee[]>> {
    return this.httpClient.get(environment.server + environment.vehicles.truckfleet.list)
      .pipe(map((responseModel: ResponseModel<Employee[]>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveEmployee(id: number): Observable<ResponseModel<Employee>> {
    return this.httpClient.get(environment.server + environment.vehicles.truckfleet.retrieve + id)
      .pipe(map((responseModel: ResponseModel<Employee>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerEmployee(truckFleet: Employee): Observable<ResponseModel<Employee>> {
    return this.httpClient.post<Employee>(environment.server + environment.vehicles.truckfleet.register, truckFleet)
      .pipe(map((responseModel: ResponseModel<Employee>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateEmployee(truckFleet: Employee): Observable<ResponseModel<Employee>> {
    return this.httpClient.put<Employee>(environment.server + environment.vehicles.truckfleet.register, truckFleet)
      .pipe(map((responseModel: ResponseModel<Employee>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

}
