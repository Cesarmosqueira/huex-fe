import {PipeTransform} from "@angular/core";
import {Rate} from "../models/rate.model";

export type SortColumn = keyof Rate | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(rates: Rate[], column: SortColumn, direction: string): Rate[] {
  if (direction === '' || column === '') {
    return rates;
  } else {
    return [...rates].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(rate: Rate, term: string, pipe: PipeTransform) {
  return rate.customer.socialReason.toLowerCase().includes(term.toLowerCase())||
    rate.route.routeEnd.toLowerCase().includes(term.toLowerCase());
}
