import { ExpenseType } from "../../expense-type/models/expense-type.model";
import { Tracking } from "../../tracking/models/tracking.model";

export class SettlementSummary {
  id: any;
  trackingService: Tracking;
  expenseType: ExpenseType;
  settlementDate: any;
  detail: string;
  totalExpense: number;
}
