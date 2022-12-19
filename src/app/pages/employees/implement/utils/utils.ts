import { PipeTransform } from "@angular/core";
import {Implement} from "../models/implement.model";

export type SortColumn = keyof Implement | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(implement: Implement[], column: SortColumn, direction: string): Implement[] {
    if (direction === '' || column === '') {
        return implement;
    } else {
        return [...implement].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(implement: Implement, term: string, pipe: PipeTransform) {
    return implement.name.toLowerCase().includes(term.toLowerCase());
}
