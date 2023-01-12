import {PipeTransform} from "@angular/core";
import {ProvinceEstivators} from "../models/province-estivators.model";

export type SortColumn = keyof ProvinceEstivators | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(provinceEstivators: ProvinceEstivators[], column: SortColumn, direction: string): ProvinceEstivators[] {
  if (direction === '' || column === '') {
    return provinceEstivators;
  } else {
    return [...provinceEstivators].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(provinceEstivators: ProvinceEstivators, term: string, pipe: PipeTransform) {
  return provinceEstivators.route.routeEnd.toLowerCase().includes(term.toLowerCase());
}
