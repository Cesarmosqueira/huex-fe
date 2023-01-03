import {ServiceMonitoring} from "../models/service-monitoring.model";

export interface SearchResult {
  serviceMonitoring: ServiceMonitoring[];
  total: number;
}
