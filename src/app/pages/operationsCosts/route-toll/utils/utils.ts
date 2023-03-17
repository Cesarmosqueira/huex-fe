import {PipeTransform} from "@angular/core";
import {RouteToll} from "../models/route-toll.model";

export type SortColumn = keyof RouteToll | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(routeToll: RouteToll[], column: SortColumn, direction: string): RouteToll[] {
  if (direction === '' || column === '') {
    return routeToll;
  } else {
    return [...routeToll].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
export function matchesConfiguration(routeToll: RouteToll, term: string, pipe: PipeTransform) {
  return routeToll.toll.configuration.toLowerCase().includes(term.toLowerCase());
}

export function matches(routeToll: RouteToll, term: string, pipe: PipeTransform) {
  return routeToll.route.routeEnd.toLowerCase().includes(term.toLowerCase());
}
