import { OrgDetails } from "./client";
import {
  BranchBidParameters,
  AdgroupBidParameters,
  BidParameters,
  KeywordAdderParameters,
  Client,
} from "./client";

export class BranchBidParametersPayload {
  branch_bid_adjustment: number;
  branch_optimization_goal: string;
  min_apple_installs: number;
  branch_min_bid: number;
  revenue_over_ad_spend_threshold: number;
  revenue_over_ad_spend_threshold_buffer: number;
  cost_per_purchase_threshold: number;
  cost_per_purchase_threshold_buffer: number;
  objective: string;

  static buildFromClient(params: BranchBidParameters) {
    const retVal = new BranchBidParametersPayload();
    retVal.branch_bid_adjustment = params.branchBidAdjustment;
    retVal.branch_optimization_goal = params.branchOptimizationGoal;
    retVal.min_apple_installs = params.minAppleInstalls;
    retVal.branch_min_bid = params.branchMinBid;
    retVal.revenue_over_ad_spend_threshold = params.revenueOverAdSpendThreshold;
    retVal.revenue_over_ad_spend_threshold_buffer =
      params.revenueOverAdSpendThresholdBuffer;
    retVal.cost_per_purchase_threshold = params.costPerPurchaseThreshold;
    retVal.cost_per_purchase_threshold_buffer =
      params.costPerPurchaseThresholdBuffer;
    retVal.objective = params.objective;
    return retVal;
  }
}

export class AdgroupBidParametersPayload {
  HIGH_CPA_BID_DECREASE: number;
  TAP_THRESHOLD: number;
  LOW_CPI_BID_INCREASE_THRESH: number;
  OBJECTIVE: number;
  MIN_BID: number;
  NO_INSTALL_BID_DECREASE_THRESH: number;
  HIGH_CPI_BID_DECREASE_THRESH: number;
  LOW_CPA_BID_BOOST: number;
  MAX_BID: number;
  STALE_RAISE_BID_BOOST: number;
  STALE_RAISE_IMPRESSION_THRESH: number;

  static buildFromClient(params: AdgroupBidParameters) {
    const response = new AdgroupBidParametersPayload();
    response.HIGH_CPA_BID_DECREASE = params.highCPABidDecrease;
    response.TAP_THRESHOLD = params.tapThreshold;
    response.LOW_CPI_BID_INCREASE_THRESH = params.lowCPIBidIncreaseThresh;
    response.OBJECTIVE = params.objective;
    response.MIN_BID = params.minBid;
    response.NO_INSTALL_BID_DECREASE_THRESH = params.noInstallBidDecreaseThresh;
    response.HIGH_CPI_BID_DECREASE_THRESH = params.highCPIBidDecreaseThresh;
    response.LOW_CPA_BID_BOOST = params.lowCPABidBoost;
    response.MAX_BID = params.maxBid;
    response.STALE_RAISE_BID_BOOST = params.staleRaiseBidBoost;
    response.STALE_RAISE_IMPRESSION_THRESH = params.staleRaiseImpresshionThresh;
    return response;
  }
}

export class BidParametersPayload {
  HIGH_CPA_BID_DECREASE: number;
  TAP_THRESHOLD: number;
  OBJECTIVE: string;
  MIN_BID: number;
  NO_INSTALL_BID_DECREASE_THRESH: number;
  HIGH_CPI_BID_DECREASE_THRESH: number;
  LOW_CPA_BID_BOOST: number;
  MAX_BID: number;
  STALE_RAISE_BID_BOOST: string;
  STALE_RAISE_IMPRESSION_THRESH: string;

  static buildFromClient(params: BidParameters) {
    const response = new BidParametersPayload();
    response.HIGH_CPA_BID_DECREASE = params.highCPABidDecrease;
    response.TAP_THRESHOLD = params.tapThreshold;
    response.OBJECTIVE = params.objective;
    response.MIN_BID = params.minBid;
    response.NO_INSTALL_BID_DECREASE_THRESH = params.noInstallBidDecreaseThresh;
    response.HIGH_CPI_BID_DECREASE_THRESH = params.highCPIBidDecreaseThresh;
    response.LOW_CPA_BID_BOOST = params.lowCPABidBoost;
    response.MAX_BID = params.maxBid;
    response.STALE_RAISE_BID_BOOST = params.staleRaiseBidBoost;
    response.STALE_RAISE_IMPRESSION_THRESH = params.staleRaiseImpresshionThresh;
    return response;
  }
}

export class KeywordAdderParametersPayload {
  TARGETED_KEYWORD_TAP_THRESHOLD: number;
  NEGATIVE_KEYWORD_CONVERSION_THRESHOLD: number;
  BROAD_MATCH_DEFAULT_BID: number;
  EXACT_MATCH_DEFAULT_BID: number;
  NEGATIVE_KEYWORD_TAP_THRESHOLD: number;
  TARGETED_KEYWORD_CONVERSION_THRESHOLD: number;

  static buildFromClient(params: KeywordAdderParameters) {
    const response = new KeywordAdderParametersPayload();
    response.TARGETED_KEYWORD_TAP_THRESHOLD =
      params.targetedKeywordTapThreshold;
    response.NEGATIVE_KEYWORD_CONVERSION_THRESHOLD =
      params.negativeKeywordConversionThreshold;
    response.BROAD_MATCH_DEFAULT_BID = params.broadMatchDefaultBid;
    response.EXACT_MATCH_DEFAULT_BID = params.exactMatchDefaultBid;
    response.NEGATIVE_KEYWORD_TAP_THRESHOLD =
      params.negativeKeywordTapThreshold;
    response.TARGETED_KEYWORD_CONVERSION_THRESHOLD =
      params.targetedKeywordConversionThreshold;

    return response;
  }
}

export class BranchIntegrationParametersPayload {
  branchKey: string;
  branchSecret: string;

  static buildFromClient(response: any) {
    const retVal = new BranchIntegrationParametersPayload();
    retVal.branchKey = response.branch_key;
    retVal.branchSecret = response.branch_secret;
    return retVal;
  }
}

export class AdGroupIdPayload {
  broad: string;
  exact: string;
  search: string;
  static buildFromClient(response: any) {
    const retVal = new AdGroupIdPayload();
    retVal.broad = response.broad;
    retVal.exact = response.exact;
    retVal.search = response.search;
    return retVal;
  }
}

export class CampaignIdPayload {
  broad: string;
  exact: string;
  search: string;

  static buildFromClient(response: any) {
    const retVal = new CampaignIdPayload();
    retVal.broad = response.broad;
    retVal.exact = response.exact;
    retVal.search = response.search;
    return retVal;
  }
}

export class KeywordAdderIdsPayload {
  campaignId: CampaignIdPayload;
  adGroupId: AdGroupIdPayload;

  static buildFromClient(response: any) {
    const retVal = new KeywordAdderIdsPayload();
    retVal.adGroupId = AdGroupIdPayload.buildFromClient(response.adGroupId);
    retVal.campaignId = AdGroupIdPayload.buildFromClient(response.campaignId);
    return retVal;
  }
}

export class OrgDetailsPayload {
  adgroupBidParameters: AdgroupBidParametersPayload;
  keywordAdderParameters: KeywordAdderParametersPayload;
  bidParameters: BidParametersPayload;
  keywordAdderIds: KeywordAdderIdsPayload;
  branchIntegrationParameters: BranchIntegrationParametersPayload;
  branchBidParameters: BranchBidParametersPayload;
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

  static buildFromClient(response: OrgDetails) {
    const retVal = new OrgDetailsPayload();
    retVal.campaignName = response.campaignName;
    retVal.campaignIds = response.campaignIds;
    retVal.disabled = response.disabled;
    retVal.currency = response.currency;
    retVal.appID = response.appID;
    retVal.emailAddresses = response.emailAddresses;
    retVal.keyFilename = response.keyFilename;
    retVal.orgId = response.orgId;
    retVal.pemFilename = response.pemFilename;
    retVal.appName = response.appName;
    retVal.clientName = response.clientName;
    retVal.branchBidParameters = BranchBidParametersPayload.buildFromClient(
      response.branchBidParameters
    );
    retVal.branchIntegrationParameters = BranchIntegrationParametersPayload.buildFromClient(
      response.branchIntegrationParameters
    );
    retVal.keywordAdderIds = KeywordAdderIdsPayload.buildFromClient(
      response.keywordAdderIds
    );
    retVal.branchIntegrationParameters = BranchIntegrationParametersPayload.buildFromClient(
      response.branchIntegrationParameters
    );
    retVal.bidParameters = BidParametersPayload.buildFromClient(
      response.bidParameters
    );
    retVal.keywordAdderParameters = KeywordAdderParametersPayload.buildFromClient(
      response.keywordAdderParameters
    );
    retVal.adgroupBidParameters = AdgroupBidParametersPayload.buildFromClient(
      response.adgroupBidParameters
    );
    return retVal;
  }
}

export class ClientPayload {
  orgId: number;
  orgDetails: OrgDetailsPayload;

  static buildFromClient(client: Client): any {
    const retVal = new ClientPayload();
    retVal.orgDetails = OrgDetailsPayload.buildFromClient(client.orgDetails);
    retVal.orgId = client.orgId;

    return retVal;
  }
}
