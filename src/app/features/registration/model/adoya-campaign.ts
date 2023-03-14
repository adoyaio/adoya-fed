import { chain, get, map } from "lodash";

export class AdoyaCampaign {
  adGroupId: number; // ag
  adGroupName: string; // ag
  adgroupBidAdjusterEnabled: boolean; // adoya
  bidAdjusterEnabled: boolean; // adoya
  bidParameters: any; // adoya
  branchBidParameters: any; // adoya
  campaignId: string; // campaign
  campaignName: number; // campaign
  campaignType: string; // other
  dailyBudget: number; //campaign
  gender: any; // ag
  keywordIntegrationEnabled: boolean; //adoya
  lifetimeBudget: number; //campaign
  maxAge: number; // ag
  minAge: number; // ag
  status: string; //campaign

  static buildAdoyaCampaign(asaCampaign: any, asaAdgroup: any) {
    let retVal = new AdoyaCampaign();

    // adoya vals
    retVal.adgroupBidAdjusterEnabled = false;
    retVal.bidAdjusterEnabled = true;
    retVal.keywordIntegrationEnabled = true;
    retVal.campaignType = "other";
    retVal.branchBidParameters = {};
    retVal.bidParameters = {};

    // adgroup vals
    retVal.adGroupId = get(asaAdgroup, "id");
    retVal.adGroupName = get(asaAdgroup, "name");
    retVal.gender = chain(asaAdgroup)
      .get("targetingDimensions.gender.included")
      .value();
    retVal.minAge = chain(asaAdgroup)
      .get("targetingDimensions.age.included[0].minAge", undefined)
      .value();
    retVal.minAge = chain(asaAdgroup)
      .get("targetingDimensions.age.included[0].maxAge", undefined)
      .value();

    // campaign vals
    retVal.campaignId = get(asaCampaign, "id");
    retVal.campaignName = get(asaCampaign, "name");
    retVal.dailyBudget = get(asaCampaign, "dailyBudgetAmount.amount");
    retVal.lifetimeBudget = get(asaCampaign, "budgetAmount.amount");
    retVal.status = get(asaCampaign, "displayStatus");

    return retVal;
  }
}
