import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {State} from "../../service-incidents/interfaces/state.interface";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {ResponseModel} from "../../../../shared/utils/response-model";
import {environment} from "../../../../../environments/environment";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {matchesDate,matchesName, sort, SortColumn, SortDirection} from "../../service-incidents/utils/utils";
import {SearchResult} from "../../service-incidents/interfaces/search-result.interface";
import {BaseService} from "../../../../shared/utils/base-service";
import {ServiceIncidents} from "../models/service-incidents.model";

@Injectable({
  providedIn: 'root'
})
export class ServiceIncidentsService extends BaseService{


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _serviceIncidents$ = new BehaviorSubject<ServiceIncidents[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private serviceIncidents: any;

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
    searchName: ''

  };

  constructor(protected httpClient: HttpClient, private pipe: DecimalPipe) {
    super(httpClient);
  }

  //consume APIS

  public listServiceIncidents(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.services.serviceIncidents.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveServiceIncidents(id: number): Observable<ResponseModel<ServiceIncidents>> {
    return this.httpClient.get(environment.server + environment.services.serviceIncidents.retrieve + id)
      .pipe(map((responseModel: ResponseModel<ServiceIncidents>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerServiceIncidents(serviceIncidents: ServiceIncidents): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.services.serviceIncidents.register, serviceIncidents)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateServiceIncidents(serviceIncidents: ServiceIncidents): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.services.serviceIncidents.update, serviceIncidents)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteServiceIncidents(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.services.serviceIncidents.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public listServiceIncidentsByIdTracking(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.services.serviceIncidents.listByIdTracking + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(serviceIncidents: ServiceIncidents[]) {
    this.serviceIncidents = serviceIncidents;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._serviceIncidents$.next(result.serviceIncidents);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._serviceIncidents$.asObservable(); }
  get product() { return this.products; }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get searchName() { return this._state.searchName; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set searchName(searchName: string) { this._set({ searchName }); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, page, searchTerm,searchName} = this._state;
    // 1. sort
    let serviceIncidents = sort(this.serviceIncidents, sortColumn, sortDirection);

    // 2. filter
    serviceIncidents = serviceIncidents.filter(country => matchesDate(country, searchTerm, this.pipe));
    serviceIncidents = serviceIncidents.filter(country => matchesName(country, searchName, this.pipe));

    const total = serviceIncidents.length;

    // 3. paginate
    this.totalRecords = serviceIncidents.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    serviceIncidents = serviceIncidents.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({serviceIncidents: serviceIncidents, total});
  }

}
