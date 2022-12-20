import { DocumentUnit } from "../models/document-unit.model";

export interface SearchResult {
  documentUnits: DocumentUnit[];
  total: number;
}