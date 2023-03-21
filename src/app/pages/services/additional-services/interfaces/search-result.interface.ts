import {AdditionalServices} from "../models/additional-services.model";

export interface SearchResult {
  additionalServices: AdditionalServices[];
  total: number;
}
