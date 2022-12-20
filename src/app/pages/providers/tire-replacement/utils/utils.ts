import {PipeTransform} from "@angular/core";
import {TireReplacement} from "../models/tire-replacement.model";

export type SortColumn = keyof TireReplacement | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(tireReplacements: TireReplacement[], column: SortColumn, direction: string): TireReplacement[] {
  if (direction === '' || column === '') {
    return tireReplacements;
  } else {
    return [...tireReplacements].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(tireReplacement: TireReplacement, term: string, pipe: PipeTransform) {
  return tireReplacement.observation.toLowerCase().includes(term.toLowerCase());
}
