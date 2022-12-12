import { Injectable } from '@angular/core';
import {BaseService} from "../../../../shared/utils/base-service";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {State} from "../../../customers/route/interfaces/state";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {ResponseModel} from "../../../../shared/utils/response-model";
import {environment} from "../../../../../environments/environment";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {matches, sort, SortColumn, SortDirection} from "../../../customers/route/utils/utils";
import {SearchResult} from "../../../customers/route/interfaces/search-result.interface";
import {Route} from "../models/route.model";



@Injectable({
  providedIn: 'root'
})
export class RouteService extends BaseService{

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _routes$ = new BehaviorSubject<Route[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private routes: any;

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

  public listRoutes(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.customers.route.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveRoute(id: number): Observable<ResponseModel<Route>> {
    return this.httpClient.get(environment.server + environment.customers.route.retrieve + id)
      .pipe(map((responseModel: ResponseModel<Route>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerRoute(route: Route): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.customers.route.register, route)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateRoute(route: Route): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.customers.route.update, route)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteRoute(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.customers.route.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(routes: Route[]) {
    this.routes = routes;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._routes$.next(result.routes);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._routes$.asObservable(); }
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
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
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
    const {sortColumn, sortDirection, page, searchTerm} = this._state;
    // 1. sort
    let routes = sort(this.routes, sortColumn, sortDirection);

    // 2. filter
    routes = routes.filter(country => matches(country, searchTerm, this.pipe));
    const total = routes.length;

    // 3. paginate
    this.totalRecords = routes.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    routes = routes.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({routes: routes, total});
  }

}
