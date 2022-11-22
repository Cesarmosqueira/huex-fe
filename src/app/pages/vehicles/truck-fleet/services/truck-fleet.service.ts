import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/utils/base-service';
import { ResponseModel } from 'src/app/shared/utils/response-model';
import { TruckFleet } from '../models/truck-fleet.model';
import { environment } from '../../../../../environments/environment'
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TruckFleetService extends BaseService {

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  public listTruckFleets(): Observable<ResponseModel<TruckFleet[]>> {
    return this.httpClient.get(environment.server + environment.vehicles.truckfleet.list)
      .pipe(map((responseModel: ResponseModel<TruckFleet[]>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveTruckFleet(id: number): Observable<ResponseModel<TruckFleet>> {
    return this.httpClient.get(environment.server + environment.vehicles.truckfleet.retrieve + id)
      .pipe(map((responseModel: ResponseModel<TruckFleet>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerTruckFleet(truckFleet: TruckFleet): Observable<ResponseModel<TruckFleet>> {
    return this.httpClient.post<TruckFleet>(environment.server + environment.vehicles.truckfleet.register, truckFleet)
      .pipe(map((responseModel: ResponseModel<TruckFleet>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateTruckFleet(truckFleet: TruckFleet): Observable<ResponseModel<TruckFleet>> {
    return this.httpClient.put<TruckFleet>(environment.server + environment.vehicles.truckfleet.register, truckFleet)
      .pipe(map((responseModel: ResponseModel<TruckFleet>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

}
