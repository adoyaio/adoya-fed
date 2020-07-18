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
    console.log("buildFromGetHistoryResponse");
    if (response) {
      return response.map((item) => {
        console.log("buildFromGetHistoryResponse");
        const retVal = new CostPerInstallDayObject();
        retVal.cpi = item.cpi;
        retVal.installs = item.installs;
        retVal.org_id = item.org_id;
        retVal.timestamp = item.timestamp;
        retVal.spend = item.spend;
        // branch data
        retVal.purchases = item.purchases;
        console.log(
          "buildFromGetHistoryResponse:::purchases" + retVal.purchases
        );
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
