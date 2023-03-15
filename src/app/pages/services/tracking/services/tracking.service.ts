import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/utils/base-service';
import { ResponseModel } from 'src/app/shared/utils/response-model';
import { environment } from '../../../../../environments/environment';
import { SearchResult } from '../interfaces/search-result.interface';
import { State } from '../interfaces/state.interface';
import { Tracking } from '../models/tracking.model';
import {  matchesDate, matchesName, sort, SortColumn, SortDirection } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TrackingService extends BaseService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _trackings$ = new BehaviorSubject<Tracking[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private trackings: any;

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

  public listTrackings(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.services.tracking.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveTracking(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.services.tracking.retrieve + id)
      .pipe(map((responseModel: ResponseModel<Tracking>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerTracking(Tracking: Tracking): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.services.tracking.register, Tracking)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateTracking(Tracking: Tracking): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.services.tracking.update, Tracking)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteTracking(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.services.tracking.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  downloadImage(url: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.httpClient.get<Blob>(url, options)
      .pipe(map(res => new Blob([res], { type: 'image/jpeg' })));
  }

  //Pagination

  public paginationTable(trackings: Tracking[]) {
    this.trackings = trackings;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._trackings$.next(result.trackings);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._trackings$.asObservable(); }
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

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set searchName(searchName: string) { this._set({ searchName }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, page, searchTerm, searchName } = this._state;
    // 1. sort
    let trackings = sort(this.trackings, sortColumn, sortDirection);

    // 2. filter
      trackings = trackings.filter(country => matchesDate(country, searchTerm, this.pipe));
      trackings = trackings.filter(country => matchesName(country, searchName, this.pipe));


    const total = trackings.length;

    // 3. paginate
    this.totalRecords = trackings.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    trackings = trackings.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ trackings: trackings, total });
  }
}
