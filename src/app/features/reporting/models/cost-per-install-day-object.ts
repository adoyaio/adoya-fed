import { CurrencyPipe } from "@angular/common";

export class CostPerInstallDayObject {
  cpi: string;
  installs: number;
  org_id: string;
  timestamp: string;
  spend: number;

  static buildFromGetHistoryResponse(response: any): CostPerInstallDayObject[] {
    if (response) {
      return response.map((item) => {
        const retVal = new CostPerInstallDayObject();
        retVal.cpi = item.cpi;
        retVal.installs = item.installs;
        retVal.org_id = item.org_id;
        retVal.timestamp = item.timestamp;
        retVal.spend = item.spend;
        return retVal;
      });
    } else {
      return [];
    }
  }
}
