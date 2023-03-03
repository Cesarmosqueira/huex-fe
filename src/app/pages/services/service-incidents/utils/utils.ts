import { PipeTransform } from "@angular/core";
import {ServiceIncidents} from "../models/service-incidents.model";

export type SortColumn = keyof ServiceIncidents | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(serviceIncidents: ServiceIncidents[], column: SortColumn, direction: string): ServiceIncidents[] {
    if (direction === '' || column === '') {
        return serviceIncidents;
    } else {
        return [...serviceIncidents].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(serviceIncidents: ServiceIncidents, term: string, pipe: PipeTransform) {

  return serviceIncidents.trackingService.truckFleet.tractPlate.toLowerCase().includes(term.toLowerCase())
    || serviceIncidents.trackingService.dateService.toLowerCase().includes(term.toLowerCase())
    ||serviceIncidents.trackingService.rate.customer.socialReason.toLowerCase().includes(term.toLowerCase())
    || serviceIncidents.trackingService.rate.route.routeEnd.toLowerCase().includes(term.toLowerCase());

}
