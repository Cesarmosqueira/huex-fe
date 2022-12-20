import { MaintenanceTire } from "../models/maintenance-tire.model";

export interface SearchResult {
  maintenanceTires: MaintenanceTire[];
  total: number;
}