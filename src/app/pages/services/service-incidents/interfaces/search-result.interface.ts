import {ServiceIncidents} from "../models/service-incidents.model";

export interface SearchResult {
  serviceIncidents: ServiceIncidents[];
  total: number;
}
