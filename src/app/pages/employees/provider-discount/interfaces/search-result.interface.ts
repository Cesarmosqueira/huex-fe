import {ProviderDiscount} from "../models/provider-discount.model";

export interface SearchResult {
  providerDiscount: ProviderDiscount[];
  total: number;
}
