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
import { Employee } from '../models/employee.model';
import { matches, sort, SortColumn, SortDirection } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employees$ = new BehaviorSubject<Employee[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private employees: any;

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

  public listEmployees(): Observable<ResponseModel<any>> {
    return this.httpClient.get(environment.server + environment.employees.employee.list)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public retrieveEmployee(id: number): Observable<ResponseModel<Employee>> {
    return this.httpClient.get(environment.server + environment.employees.employee.retrieve + id)
      .pipe(map((responseModel: ResponseModel<Employee>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public registerEmployee(employee: Employee): Observable<ResponseModel<any>> {
    return this.httpClient.post(environment.server + environment.employees.employee.register, employee)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public updateEmployee(employee: Employee): Observable<ResponseModel<any>> {
    return this.httpClient.put(environment.server + environment.employees.employee.update, employee)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  public deleteEmployee(id: number): Observable<ResponseModel<any>> {
    return this.httpClient.delete(environment.server + environment.employees.employee.delete + id)
      .pipe(map((responseModel: ResponseModel<any>) => {
        return responseModel;
      }), catchError(this.handleError));
  }

  //Pagination

  public paginationTable(employees: Employee[]) {
    this.employees = employees;
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._employees$.next(result.employees);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._employees$.asObservable(); }
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
    let employees = sort(this.employees, sortColumn, sortDirection);    

    // 2. filter
    employees = employees.filter(country => matches(country, searchTerm, this.pipe));        
    const total = employees.length;

    // 3. paginate
    this.totalRecords = employees.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
        this.endIndex = this.totalRecords;
    }
    employees = employees.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({employees: employees, total});
  }
}
