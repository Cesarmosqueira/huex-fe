import { MaintenanceOil } from "../models/maintenance-oil.model";

export interface SearchResult {
  maintenanceOils: MaintenanceOil[];
  total: number;
}