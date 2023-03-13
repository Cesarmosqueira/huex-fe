import {FuelControl} from "../models/fuel-control.model";

export interface SearchResult {
  fuelControl: FuelControl[];
  total: number;
}
