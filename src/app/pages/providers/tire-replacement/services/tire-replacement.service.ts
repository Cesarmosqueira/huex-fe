import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {State} from "../../tire-replacement/interfaces/state";
import {HttpClient} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {ResponseModel} from "../../../../shared/utils/response-model";
import {environment} from "../../../../../environments/environment";
import {catchError, debounceTime, delay, map, switchMap, tap} from "rxjs/operators";
import {matches, sort, SortColumn, SortDirection} from "../../tire-replacement/utils/utils";
import {SearchResult} from "../../tire-replacement/interfaces/search-result.interface";
import {BaseService} from "../../../../shared/utils/base-service";
import {TireReplacement} from "../models/tire-replacement.model";

@Injectable({
  providedIn: 'root'
})
export class TireReplacementService extends BaseService{



  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _tireReplacement$ = new BehaviorSubject<TireReplacement[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private tireReplacement: any;

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

  public listTireReplacement(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.providers.tireReplacement.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveTireReplacement(id: number): Observable<ResponseModel<TireReplacement>> {
    return this.httpClient.get(environment.server + environment.providers.tireReplacement.retrieve + id)
      .pipe(map((responseModel: ResponseModel<TireReplacement>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerTireReplacement(tireReplacement: TireReplacement): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.providers.tireReplacement.register, tireReplacement)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateTireReplacement(tireReplacement: TireReplacement): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.providers.tireReplacement.update, tireReplacement)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteTireReplacement(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.providers.tireReplacement.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(tireReplacements: TireReplacement[]) {
    this.tireReplacement = tireReplacements;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._tireReplacement$.next(result.tireReplacement);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._tireReplacement$.asObservable(); }
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
    let tireReplacement = sort(this.tireReplacement, sortColumn, sortDirection);

    // 2. filter
    tireReplacement = tireReplacement.filter(country => matches(country, searchTerm, this.pipe));
    const total = tireReplacement.length;

    // 3. paginate
    this.totalRecords = tireReplacement.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    tireReplacement = tireReplacement.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({tireReplacement: tireReplacement, total});
  }
}
