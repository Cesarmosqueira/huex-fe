import { PipeTransform } from "@angular/core";
import {ProviderDiscount} from "../models/provider-discount.model";

export type SortColumn = keyof ProviderDiscount | '';
export type SortDirection = 'asc' | 'desc' | '';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


export function sort(providerDiscounts: ProviderDiscount[], column: SortColumn, direction: string): ProviderDiscount[] {
    if (direction === '' || column === '') {
        return providerDiscounts;
    } else {
        return [...providerDiscounts].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

export function matches(providerDiscount: ProviderDiscount, term: string, pipe: PipeTransform) {
    return providerDiscount.provider.businessName.toLowerCase().includes(term.toLowerCase());
}
