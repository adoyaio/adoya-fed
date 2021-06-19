import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { get as _get } from "lodash";

@Injectable({
  providedIn: "root",
})
export class AppleService {
  constructor(private http: HttpClient) {}
  authKey = "GerGRueNWE3qCkPG8GfPV649wyVnQEQN2oJQUpnI";

  baseUrl = environment.baseUrl;
  getAppleAppsUrl = this.baseUrl + `/apple/apps`;
  getAppleAclsUrl = this.baseUrl + `/apple/acls`;
  createAppleCampaignsUrl = this.baseUrl + `/apple/campaign`;

  public getAppleApps(orgId: string): Observable<any> {
    const url = `${this.getAppleAppsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getAppleAcls(orgId: string): Observable<any> {
    const url = `${this.getAppleAclsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public postAppleCampaign(orgId: string, campaignData: any): Observable<any> {
    const url = `${this.createAppleCampaignsUrl}?org_id=${orgId}`;
    let headers = new HttpHeaders();
    headers = headers.set("x-api-key", this.authKey);
    return this.http
      .post<any>(
        url,
        {
          org_id: _get(campaignData, "org_id"),
          app_name: _get(campaignData, "app_name"),
          adam_id: _get(campaignData, "adam_id"),
          campaign_target_country: _get(
            campaignData,
            "campaign_target_country"
          ),
          front_end_lifetime_budget: _get(
            campaignData,
            "front_end_lifetime_budget"
          ),
          front_end_daily_budget: _get(campaignData, "front_end_daily_budget"),
          objective: _get(campaignData, "objective"),
          target_cost_per_install: _get(
            campaignData,
            "target_cost_per_install"
          ),
          gender_first_entry: _get(campaignData, "gender_first_entry"),
          min_age_first_entry: _get(campaignData, "min_age_first_entry"),
          targeted_keywords_first_entry_competitor: _get(
            campaignData,
            "targeted_keywords_first_entry_competitor"
          ),
          targeted_keywords_first_entry_category: _get(
            campaignData,
            "targeted_keywords_first_entry_category"
          ),
          targeted_keywords_first_entry_brand: _get(
            campaignData,
            "targeted_keywords_first_entry_brand"
          ),
          currency: _get(campaignData, "currency"),
        },
        { headers: headers }
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          throw new Error(error.message);
        })
      );
  }
}
