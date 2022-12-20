import {PipeTransform} from "@angular/core";
import {Providers} from "../models/providers.model";

export type SortColumn = keyof Providers | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(providers: Providers[], column: SortColumn, direction: string): Providers[] {
  if (direction === '' || column === '') {
    return providers;
  } else {
    return [...providers].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(providers: Providers, term: string, pipe: PipeTransform) {
  return providers.businessName.toLowerCase().includes(term.toLowerCase());
}
