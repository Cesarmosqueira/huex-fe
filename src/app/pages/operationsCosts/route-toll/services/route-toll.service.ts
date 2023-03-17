import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {State} from "../../route-toll/interfaces/state";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {ResponseModel} from "../../../../shared/utils/response-model";
import {environment} from "../../../../../environments/environment";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {matches, matchesConfiguration, sort, SortColumn, SortDirection} from "../../route-toll/utils/utils";
import {SearchResult} from "../../route-toll/interfaces/search-result.interface";
import {BaseService} from "../../../../shared/utils/base-service";
import {RouteToll} from "../models/route-toll.model";

@Injectable({
  providedIn: 'root'
})
export class RouteTollService extends BaseService{


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _routeToll$ = new BehaviorSubject<RouteToll[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private routeToll: any;

  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 20,
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

  public listRouteTolls(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.operationsCosts.routeToll.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveRouteToll(id: number): Observable<ResponseModel<RouteToll>> {
    return this.httpClient.get(environment.server + environment.operationsCosts.routeToll.retrieve + id)
      .pipe(map((responseModel: ResponseModel<RouteToll>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerRouteToll(routeToll: RouteToll): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.operationsCosts.routeToll.register, routeToll)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateRouteToll(routeToll: RouteToll): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.operationsCosts.routeToll.update, routeToll)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteRouteToll(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.operationsCosts.routeToll.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(routeToll: RouteToll[]) {
    this.routeToll = routeToll;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._routeToll$.next(result.routeToll);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._routeToll$.asObservable(); }
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
    let routeToll = sort(this.routeToll, sortColumn, sortDirection);

    // 2. filter
    routeToll = routeToll.filter(country => matches(country, searchTerm, this.pipe));
    routeToll = routeToll.filter(country => matchesConfiguration(country, searchName, this.pipe));


    const total = routeToll.length;

    // 3. paginate
    this.totalRecords = routeToll.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    routeToll = routeToll.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({routeToll: routeToll, total});
  }
}
