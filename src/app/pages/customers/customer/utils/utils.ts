import {PipeTransform} from "@angular/core";
import {Customer} from "../models/customer.model";

export type SortColumn = keyof Customer | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(customers: Customer[], column: SortColumn, direction: string): Customer[] {
  if (direction === '' || column === '') {
    return customers;
  } else {
    return [...customers].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(customers: Customer, term: string, pipe: PipeTransform) {
  return customers.socialReason.toLowerCase().includes(term.toLowerCase());
}
