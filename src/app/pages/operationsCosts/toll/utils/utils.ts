import {PipeTransform} from "@angular/core";
import {Toll} from "../models/toll.model";

export type SortColumn = keyof Toll | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(toll: Toll[], column: SortColumn, direction: string): Toll[] {
  if (direction === '' || column === '') {
    return toll;
  } else {
    return [...toll].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(toll: Toll, term: string, pipe: PipeTransform) {
  return toll.place.toLowerCase().includes(term.toLowerCase());
}
