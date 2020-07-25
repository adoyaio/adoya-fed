import { CurrencyPipe } from "@angular/common";

export class CostPerInstallDayObject {
  org_id: string;
  timestamp: string;
  spend: string;
  installs: number;
  cpi: string;
  purchases: number;
  revenue: number;
  cpp: string;
  revenueOverCost: string;

  static buildFromGetHistoryResponse(response: any): CostPerInstallDayObject[] {
    if (response) {
      return response.map((item) => {
        const retVal = new CostPerInstallDayObject();
        retVal.cpi = item.cpi;
        retVal.installs = item.installs;
        retVal.org_id = item.org_id;
        retVal.timestamp = item.timestamp;
        retVal.spend = item.spend;
        // branch data
        retVal.purchases = item.purchases;

        retVal.revenue = item.revenue;
        retVal.cpp = item.cpp;
        retVal.revenueOverCost = item.revenueOverCost;

        return retVal;
      });
    } else {
      return [];
    }
  }
}
