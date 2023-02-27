import { PipeTransform } from "@angular/core";
import {Tracking} from "../models/tracking.model";

export type SortColumn = keyof Tracking | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(trackings: Tracking[], column: SortColumn, direction: string): Tracking[] {
    if (direction === '' || column === '') {
        return trackings;
    } else {
        return [...trackings].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(tracking: Tracking, term: string, pipe: PipeTransform) {

  return tracking.truckFleet.tractPlate.toLowerCase().includes(term.toLowerCase())||
    tracking.rate.route.routeEnd.toLowerCase().includes(term.toLowerCase())||
    tracking.rate.customer.socialReason.toLowerCase().includes(term.toLowerCase())||
    tracking.dateService.toLowerCase().includes(term.toLowerCase());
}
