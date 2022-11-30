import { PipeTransform } from "@angular/core";
import { TruckFleet } from "../models/truck-fleet.model";

export type SortColumn = keyof TruckFleet | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(truckFleets: TruckFleet[], column: SortColumn, direction: string): TruckFleet[] {
    if (direction === '' || column === '') {
        return truckFleets;
    } else {
        return [...truckFleets].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(truckFleet: TruckFleet, term: string, pipe: PipeTransform) {
    return truckFleet.tractPlate.toLowerCase().includes(term.toLowerCase());
}