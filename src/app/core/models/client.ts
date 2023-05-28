import { chain, get } from "lodash";

export class BranchBidParameters {
  branchBidAdjustment: number;
  branchOptimizationGoal: string;
  minAppleInstalls: number;
  branchMinBid: number;
  branchMaxBid: number;
  revenueOverAdSpendThreshold: number;
  revenueOverAdSpendThresholdBuffer: number;
  costPerPurchaseThreshold: number;
  costPerPurchaseThresholdBuffer: number;

  static buildFromResponse(response: any) {
    const retVal = new BranchBidParameters();

    retVal.branchBidAdjustment = response.branch_bid_adjustment;
    retVal.branchOptimizationGoal = response.branch_optimization_goal;
    retVal.minAppleInstalls = response.min_apple_installs;
    retVal.branchMinBid = response.branch_min_bid;
    retVal.branchMaxBid = response.branch_max_bid;
    retVal.revenueOverAdSpendThreshold =
      response.revenue_over_ad_spend_threshold;
    retVal.costPerPurchaseThresholdBuffer =
      response.cost_per_purchase_threshold_buffer;
    retVal.costPerPurchaseThreshold = response.cost_per_purchase_threshold;
    retVal.revenueOverAdSpendThresholdBuffer =
      response.revenue_over_ad_spend_threshold_buffer;

    return retVal;
  }
}

export class AdgroupBidParameters {
  highCPABidDecrease: number;
  tapThreshold: number;
  lowCPIBidIncreaseThresh: number;
  objective: string;
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
  staleRaiseBidBoost: number;
  staleRaiseImpresshionThresh: number;

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
  branchBidAdjusterEnabled: boolean;
  branchKey: string;
  branchSecret: string;

  static buildFromResponse(response: any) {
    const retVal = new BranchIntegrationParameters();
    retVal.branchBidAdjusterEnabled = response.branch_bid_adjuster_enabled;
    retVal.branchKey = response.branch_key;
    retVal.branchSecret = response.branch_secret;
    return retVal;
  }
}

export class OrgDetails {
  adgroupBidParameters: AdgroupBidParameters;
  keywordAdderParameters: KeywordAdderParameters;
  bidParameters: BidParameters;
  branchIntegrationParameters: BranchIntegrationParameters;
  branchBidParameters: BranchBidParameters;
  clientName: string;
  appName: string;
  pemFilename: string;
  // orgId: string;
  // asaId: number;
  orgId: number;
  keyFilename: string;
  emailAddresses: string[];
  appID: string;
  currency: string;
  disabled: boolean;
  appleCampaigns: any[];
  auth: any;
  hasRegistered: boolean;
  hasInvitedApiUser: boolean;
  isActiveClient: boolean;

  static buildFromResponse(response: any) {
    const retVal = new OrgDetails();
    retVal.auth = response.auth;
    retVal.hasRegistered = response.hasRegistered;
    retVal.hasInvitedApiUser = response.hasInvitedApiUser;
    retVal.isActiveClient = response.isActiveClient;
    retVal.appleCampaigns = response.appleCampaigns;
    retVal.disabled = response.disabled;
    retVal.currency = response.currency;
    retVal.appID = response.appID;
    retVal.emailAddresses = response.emailAddresses;
    retVal.keyFilename = response.keyFilename;
    retVal.orgId = response.asaId; // orgdetail org is asa id
    retVal.pemFilename = response.pemFilename;
    retVal.appName = response.appName;
    retVal.clientName = response.clientName;
    retVal.branchBidParameters = BranchBidParameters.buildFromResponse(
      response.branchBidParameters
    );
    retVal.branchIntegrationParameters =
      BranchIntegrationParameters.buildFromResponse(
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
  orgId: string;
  orgDetails: OrgDetails;

  static buildFromGetClientResponse(response: any, orgId: string): Client {
    const retVal = new Client();
    // TODO response shouldn't be a pythonic/blackbox client, it should return complete dynamo response
    retVal.orgDetails = OrgDetails.buildFromResponse(response);
    retVal.orgId = orgId;
    return retVal;
  }

  static buildListFromResponse(response: any): Array<Client> {
    const retVal = chain(response)
      .map((org) => {
        return Client.buildFromGetClientResponse(org.orgDetails, org.orgId);
      })
      .value();

    return retVal;
  }
}
