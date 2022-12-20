import {PipeTransform} from "@angular/core";
import {CustomerEmployees} from "../models/customer-employees.model";

export type SortColumn = keyof CustomerEmployees | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(customerEmployees: CustomerEmployees[], column: SortColumn, direction: string): CustomerEmployees[] {
  if (direction === '' || column === '') {
    return customerEmployees;
  } else {
    return [...customerEmployees].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(customerEmployees: CustomerEmployees, term: string, pipe: PipeTransform) {
  return customerEmployees.status.toLowerCase().includes(term.toLowerCase());
}
