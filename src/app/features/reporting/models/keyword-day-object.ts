export class KeywordDayObject {
  date: string;
  adgroup_id: string;
  taps: number;
  matchType: string;
  avg_cpt: number;
  re_downloads: number;
  keywordStatus: string;
  avg_cpa: number;
  lat_off_installs: number;
  keyword: string;
  conversion_rate: number;
  campaign_id: string;
  lat_on_installs: number;
  local_spend: number;
  adgroup_deleted: string;
  impressions: number;
  installs: number;
  deleted: boolean;
  ttr: number;
  keyword_id: string;
  org_id: string;
  keywordDisplayStatus: string;
  bid: number;
  new_downloads: number;
  modification_time: string;
  adgroup_name: string;

  //   {
  //     "date": "2020-06-10",
  //     "adgroup_id": "187192993",
  //     "taps": 0,
  //     "matchType": "BROAD",
  //     "avg_cpt": 0,
  //     "re_downloads": 0,
  //     "keywordStatus": "PAUSED",
  //     "avg_cpa": 0,
  //     "lat_off_installs": 0,
  //     "keyword": "star wars",
  //     "conversion_rate": 0,
  //     "campaign_id": "187214904",
  //     "lat_on_installs": 0,
  //     "local_spend": 0,
  //     "adgroup_deleted": "False",
  //     "impressions": 0,
  //     "installs": 0,
  //     "deleted": false,
  //     "ttr": 0,
  //     "keyword_id": "204055073",
  //     "org_id": "1105630",
  //     "keywordDisplayStatus": "PAUSED",
  //     "bid": 0.01,
  //     "new_downloads": 0,
  //     "modification_time": "2018-10-27",
  //     "adgroup_name": "broad_match"
  // },

  // static buildFromGetHistoryResponse(response: any): KeywordDayObject[] {
  //   if (response) {
  //     return response.map((item) => {
  //       const retVal = new KeywordDayObject();
  //       return retVal;
  //     });
  //   } else {
  //     return [];
  //   }
  // }
}
