import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { BaseService } from 'src/app/shared/utils/base-service';
import { ResponseModel } from 'src/app/shared/utils/response-model';
import { MaintenanceOil } from '../models/maintenance-oil.model';
import { environment } from '../../../../../environments/environment'
import { catchError, debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { State } from '../interfaces/state.interface';
import { DecimalPipe } from '@angular/common';
import { SearchResult } from '../interfaces/search-result.interface';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceOilService extends BaseService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _maintenanceOils$ = new BehaviorSubject<MaintenanceOil[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private maintenanceOils: any;

  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    payment: '',
    date: '',
  };

  constructor(protected httpClient: HttpClient, private pipe: DecimalPipe) {
    super(httpClient);
  }




  //consume APIS

  public listMaintenanceOils(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceOil.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveMaintenanceOil(id: number): Observable<ResponseModel<MaintenanceOil>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceOil.retrieve + id)
      .pipe(map((responseModel: ResponseModel<MaintenanceOil>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerMaintenanceOil(maintenanceOil: MaintenanceOil): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.vehicles.maintenanceOil.register, maintenanceOil)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateMaintenanceOil(maintenanceOil: MaintenanceOil): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.vehicles.maintenanceOil.update, maintenanceOil)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteMaintenanceOil(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.vehicles.maintenanceOil.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public listByIdTruckFleet(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceOil.listByIdTruckFleet + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(maintenanceOils: MaintenanceOil[]) {
    this.maintenanceOils = maintenanceOils;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._maintenanceOils$.next(result.maintenanceOils);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._maintenanceOils$.asObservable(); }
  get product() { return this.products; }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {page} = this._state;

    let maintenanceOils = this.maintenanceOils;       
    const total = maintenanceOils.length;

    // 3. paginate
    this.totalRecords = maintenanceOils.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    maintenanceOils = maintenanceOils.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({maintenanceOils: maintenanceOils, total});
  }
}
