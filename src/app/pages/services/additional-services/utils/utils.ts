import { PipeTransform } from "@angular/core";
import {AdditionalServices} from "../models/additional-services.model";

export type SortColumn = keyof AdditionalServices | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(additionalServices: AdditionalServices[], column: SortColumn, direction: string): AdditionalServices[] {
    if (direction === '' || column === '') {
        return additionalServices;
    } else {
        return [...additionalServices].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(additionalServices: AdditionalServices, term: string, pipe: PipeTransform) {
    return additionalServices.customer.socialReason.toLowerCase().includes(term.toLowerCase());
}
