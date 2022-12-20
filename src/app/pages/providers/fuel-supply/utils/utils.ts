import {PipeTransform} from "@angular/core";
import {FuelSupply} from "../models/fuel-supply.model";

export type SortColumn = keyof FuelSupply | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(fuelSupply: FuelSupply[], column: SortColumn, direction: string): FuelSupply[] {
  if (direction === '' || column === '') {
    return fuelSupply;
  } else {
    return [...fuelSupply].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

export function matches(fuelSupply: FuelSupply, term: string, pipe: PipeTransform) {
  return fuelSupply.observation.toLowerCase().includes(term.toLowerCase());
}
