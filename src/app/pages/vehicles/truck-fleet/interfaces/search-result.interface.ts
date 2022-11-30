import { TruckFleet } from "../models/truck-fleet.model";

export interface SearchResult {
  truckFleets: TruckFleet[];
  total: number;
}