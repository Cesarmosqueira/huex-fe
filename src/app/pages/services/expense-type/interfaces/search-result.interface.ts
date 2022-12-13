import {ExpenseType} from "../models/expense-type.model";

export interface SearchResult {
  expenseType: ExpenseType[];
  total: number;
}
