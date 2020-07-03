import { AppRoutingModule } from "./../../../app-routing.module";
import { CurrencyPipe } from "@angular/common";
import { ResolvedStaticSymbol } from "@angular/compiler";

export class BranchBidParameters {
  branchBidAdjustment: number;
  branchOptimizationGoal: string;
  minAppleInstalls: number;
  branchMinBid: number;
  revenueOverAdSpendThreshold: number;
  revenueOverAdSpendThresholdBuffer: number;
  costPerPurchaseThreshold: number;
  costPerPurchaseThresholdBuffer: number;
  objective: string;

  static buildFromResponse(response: any) {
    const retVal = new BranchBidParameters();
    console.log("buildFromResponse" + response);
    retVal.branchBidAdjustment = response.branch_bid_adjustment;
    retVal.branchOptimizationGoal = response.branch_optimization_goal;
    retVal.minAppleInstalls = response.min_apple_installs;
    retVal.branchMinBid = response.branch_min_bid;
    retVal.revenueOverAdSpendThreshold =
      response.revenue_over_ad_spend_threshold;
    retVal.revenueOverAdSpendThresholdBuffer =
      response.revenue_over_ad_spend_threshold_buffer;
    retVal.costPerPurchaseThreshold = response.cost_per_purchase_threshold;
    retVal.costPerPurchaseThresholdBuffer =
      response.cost_per_purchase_threshold_buffer;
    retVal.objective = response.objective;

    console.log(retVal.branchOptimizationGoal);
    return retVal;
  }
}

export class AdgroupBidParameters {
  highCPABidDecrease: number;
  tapThreshold: number;
  lowCPIBidIncreaseThresh: number;
  objective: number;
  minBid: number;
  noInstallBidDecreaseThresh: number;
  highCPIBidDecreaseThresh: number;
  lowCPABidBoost: number;
  maxBid: number;
  staleRaiseBidBoost: number;
  staleRaiseImpresshionThresh: number;

  static buildFromResponse(response: any) {
    const retVal = new AdgroupBidParameters();
    retVal.highCPABidDecrease = response.HIGH_CPA_BID_DECREASE;
    retVal.tapThreshold = response.TAP_THRESHOLD;
    retVal.lowCPIBidIncreaseThresh = response.LOW_CPI_BID_INCREASE_THRESH;
    retVal.objective = response.OBJECTIVE;
    retVal.minBid = response.MIN_BID;
    retVal.noInstallBidDecreaseThresh = response.NO_INSTALL_BID_DECREASE_THRESH;
    retVal.highCPIBidDecreaseThresh = response.HIGH_CPI_BID_DECREASE_THRESH;
    retVal.lowCPABidBoost = response.LOW_CPA_BID_BOOST;
    retVal.maxBid = response.MAX_BID;
    retVal.staleRaiseBidBoost = response.STALE_RAISE_BID_BOOST;
    retVal.staleRaiseImpresshionThresh = response.STALE_RAISE_IMPRESSION_THRESH;
    return retVal;
  }
}

export class BidParameters {
  highCPABidDecrease: number;
  tapThreshold: number;
  objective: string;
  minBid: number;
  noInstallBidDecreaseThresh: number;
  highCPIBidDecreaseThresh: number;
  lowCPABidBoost: number;
  maxBid: number;
  staleRaiseBidBoost: string;
  staleRaiseImpresshionThresh: string;

  static buildFromResponse(response: any) {
    const retVal = new BidParameters();
    retVal.highCPABidDecrease = response.HIGH_CPA_BID_DECREASE;
    retVal.tapThreshold = response.TAP_THRESHOLD;
    retVal.objective = response.OBJECTIVE;
    retVal.minBid = response.MIN_BID;
    retVal.noInstallBidDecreaseThresh = response.NO_INSTALL_BID_DECREASE_THRESH;
    retVal.highCPIBidDecreaseThresh = response.HIGH_CPI_BID_DECREASE_THRESH;
    retVal.lowCPABidBoost = response.LOW_CPA_BID_BOOST;
    retVal.maxBid = response.MAX_BID;
    retVal.staleRaiseBidBoost = response.STALE_RAISE_BID_BOOST;
    retVal.staleRaiseImpresshionThresh = response.STALE_RAISE_IMPRESSION_THRESH;
    return retVal;
  }
}

export class KeywordAdderParameters {
  targetedKeywordTapThreshold: number;
  negativeKeywordConversionThreshold: number;
  broadMatchDefaultBid: number;
  exactMatchDefaultBid: number;
  negativeKeywordTapThreshold: number;
  targetedKeywordConversionThreshold: number;

  static buildFromResponse(response: any) {
    const retVal = new KeywordAdderParameters();
    retVal.targetedKeywordTapThreshold =
      response.TARGETED_KEYWORD_TAP_THRESHOLD;
    retVal.negativeKeywordConversionThreshold =
      response.NEGATIVE_KEYWORD_CONVERSION_THRESHOLD;
    retVal.broadMatchDefaultBid = response.BROAD_MATCH_DEFAULT_BID;
    retVal.exactMatchDefaultBid = response.EXACT_MATCH_DEFAULT_BID;
    retVal.negativeKeywordTapThreshold =
      response.NEGATIVE_KEYWORD_TAP_THRESHOLD;
    retVal.targetedKeywordConversionThreshold =
      response.TARGETED_KEYWORD_CONVERSION_THRESHOLD;
    return retVal;
  }
}

export class BranchIntegrationParameters {
  branchKey: string;
  branchSecret: string;

  static buildFromResponse(response: any) {
    const retVal = new BranchIntegrationParameters();
    retVal.branchKey = response.branch_key;
    retVal.branchSecret = response.branch_secret;
    return retVal;
  }
}

export class AdGroupId {
  broad: string;
  exact: string;
  search: string;
  static buildFromResponse(response: any) {
    const retVal = new AdGroupId();
    retVal.broad = response.broad;
    retVal.exact = response.exact;
    retVal.search = response.search;
    return retVal;
  }
}

export class CampaignId {
  broad: string;
  exact: string;
  search: string;

  static buildFromResponse(response: any) {
    const retVal = new CampaignId();
    retVal.broad = response.broad;
    retVal.exact = response.exact;
    retVal.search = response.search;
    return retVal;
  }
}

export class KeywordAdderIds {
  campaignId: CampaignId;
  adGroupId: AdGroupId;

  static buildFromResponse(response: any) {
    const retVal = new KeywordAdderIds();
    retVal.adGroupId = AdGroupId.buildFromResponse(response.adGroupId);
    retVal.campaignId = AdGroupId.buildFromResponse(response.campaignId);
    return retVal;
  }
}

export class OrgDetails {
  adgroupBidParameters: AdgroupBidParameters;
  keywordAdderParameters: KeywordAdderParameters;
  bidParameters: BidParameters;
  keywordAdderIds: KeywordAdderIds;
  branchIntegrationParameters: BranchIntegrationParameters;
  branchBidParameters: BranchBidParameters;
  clientName: string;
  appName: string;
  pemFilename: string;
  orgId: number;
  keyFilename: string;
  emailAddresses: string[];
  appID: string;
  currency: string;
  disabled: boolean;
  campaignIds: string[];
  campaignName: string;

  static buildFromResponse(response: any) {
    console.log("orgdetails " + response);
    const retVal = new OrgDetails();
    retVal.campaignName = response.campaignName;
    retVal.campaignIds = response.campaignIds;
    retVal.disabled = response.disabled;
    retVal.currency = response.currency;
    retVal.appID = response.appID;
    retVal.emailAddresses = response.emailAddresses;
    console.log("buildFromResponse " + response.keyFilename);
    retVal.keyFilename = response.keyFilename;
    retVal.orgId = response.orgId;
    retVal.pemFilename = response.pemFilename;
    retVal.appName = response.appName;
    retVal.clientName = response.clientName;
    retVal.branchBidParameters = BranchBidParameters.buildFromResponse(
      response.branchBidParameters
    );
    retVal.branchIntegrationParameters = BranchIntegrationParameters.buildFromResponse(
      response.branchIntegrationParameters
    );
    retVal.keywordAdderIds = KeywordAdderIds.buildFromResponse(
      response.keywordAdderIds
    );
    retVal.branchIntegrationParameters = BranchIntegrationParameters.buildFromResponse(
      response.branchIntegrationParameters
    );
    retVal.bidParameters = BidParameters.buildFromResponse(
      response.bidParameters
    );
    retVal.keywordAdderParameters = KeywordAdderParameters.buildFromResponse(
      response.keywordAdderParameters
    );
    retVal.adgroupBidParameters = AdgroupBidParameters.buildFromResponse(
      response.adgroupBidParameters
    );
    return retVal;
  }
}

export class Client {
  orgId: number;
  orgDetails: OrgDetails;

  static buildFromGetClientResponse(response: any): Client {
    const retVal = new Client();
    retVal.orgDetails = OrgDetails.buildFromResponse(response.orgDetails);
    retVal.orgId = response.orgId;

    return retVal;
  }
}
