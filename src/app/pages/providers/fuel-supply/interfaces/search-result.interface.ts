import {FuelSupply} from "../models/fuel-supply.model";

export interface SearchResult {
  fuelSupply: FuelSupply[];
  total: number;
}
