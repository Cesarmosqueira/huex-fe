import { PipeTransform } from "@angular/core";
import {ServiceMonitoring} from "../models/service-monitoring.model";

export type SortColumn = keyof ServiceMonitoring | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(serviceMonitoring: ServiceMonitoring[], column: SortColumn, direction: string): ServiceMonitoring[] {
    if (direction === '' || column === '') {
        return serviceMonitoring;
    } else {
        return [...serviceMonitoring].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(serviceMonitoring: ServiceMonitoring, term: string, pipe: PipeTransform) {
    return serviceMonitoring.dateHour.toLowerCase().includes(term.toLowerCase());
}
