import { PipeTransform } from "@angular/core";
import {SettlementSummary} from "../models/settlement-summary.model";

export type SortColumn = keyof SettlementSummary | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(settlementSummaries: SettlementSummary[], column: SortColumn, direction: string): SettlementSummary[] {
    if (direction === '' || column === '') {
        return settlementSummaries;
    } else {
        return [...settlementSummaries].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(settlementSummary: SettlementSummary, term: string, pipe: PipeTransform) {
    return settlementSummary.detail.toLowerCase().includes(term.toLowerCase());
}
