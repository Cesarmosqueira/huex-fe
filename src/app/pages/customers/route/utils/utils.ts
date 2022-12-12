import {PipeTransform} from "@angular/core";
import {Route} from "../models/route.model";

export type SortColumn = keyof Route | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(routes: Route[], column: SortColumn, direction: string): Route[] {
  if (direction === '' || column === '') {
    return routes;
  } else {
    return [...routes].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(route: Route, term: string, pipe: PipeTransform) {
  return route.routeStart.toLowerCase().includes(term.toLowerCase());
}
