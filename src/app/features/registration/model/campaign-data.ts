export class CampaignData {
  org_id: string;
  app_name: string;
  adam_id: string;
  campaign_target_country: string;
  lifetime_budget: number;
  daily_budget: number;
  objective: string;
  target_cost_per_install: number;
  gender: string;
  min_age: string;
  currency: string;
  targeted_keywords_competitor: string[];
  targeted_keywords_category: string[];
  targeted_keywords_brand: string[];
  campaignType: string;
  authToken: any;
}

export class CampaignUpdateData {
  lifetime_budget: number;
  daily_budget: number;
  currency: string;
  status: CampaignStatus;
}

export enum CampaignStatus {
  ENABLED = "ENABLED",
  PAUSED = "PAUSED",
}
