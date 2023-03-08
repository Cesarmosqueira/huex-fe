import { PipeTransform } from "@angular/core";
import {FuelControl} from "../models/fuel-control.model";

export type SortColumn = keyof FuelControl | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(fuelControl: FuelControl[], column: SortColumn, direction: string): FuelControl[] {
    if (direction === '' || column === '') {
        return fuelControl;
    } else {
        return [...fuelControl].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(fuelControl: FuelControl, term: string, pipe: PipeTransform) {
    return fuelControl.trackingService.truckFleet.tractPlate.toLowerCase().includes(term.toLowerCase());
}
