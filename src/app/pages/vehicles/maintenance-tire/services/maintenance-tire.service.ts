import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { BaseService } from 'src/app/shared/utils/base-service';
import { ResponseModel } from 'src/app/shared/utils/response-model';
import { MaintenanceTire } from '../models/maintenance-tire.model';
import { environment } from '../../../../../environments/environment'
import { catchError, debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { State } from '../interfaces/state.interface';
import { DecimalPipe } from '@angular/common';
import { SearchResult } from '../interfaces/search-result.interface';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceTireService extends BaseService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _maintenanceTires$ = new BehaviorSubject<MaintenanceTire[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private maintenanceTires: any;

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

  public listMaintenanceTires(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceTire.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveMaintenanceTire(id: number): Observable<ResponseModel<MaintenanceTire>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceTire.retrieve + id)
      .pipe(map((responseModel: ResponseModel<MaintenanceTire>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerMaintenanceTire(maintenanceTire: MaintenanceTire): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.vehicles.maintenanceTire.register, maintenanceTire)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateMaintenanceTire(maintenanceTire: MaintenanceTire): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.vehicles.maintenanceTire.update, maintenanceTire)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteMaintenanceTire(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.vehicles.maintenanceTire.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public listByIdTruckFleet(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.vehicles.maintenanceTire.listByIdTruckFleet + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(maintenanceTires: MaintenanceTire[]) {
    this.maintenanceTires = maintenanceTires;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._maintenanceTires$.next(result.maintenanceTires);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._maintenanceTires$.asObservable(); }
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

    let maintenanceTires = this.maintenanceTires;       
    const total = maintenanceTires.length;

    // 3. paginate
    this.totalRecords = maintenanceTires.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    maintenanceTires = maintenanceTires.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({maintenanceTires: maintenanceTires, total});
  }
}
