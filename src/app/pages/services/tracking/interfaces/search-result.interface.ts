import {Tracking} from "../models/tracking.model";

export interface SearchResult {
  trackings: Tracking[];
  total: number;
}
